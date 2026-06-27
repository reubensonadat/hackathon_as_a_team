-- BorlaBoard initial schema migration
-- Apply: supabase db push  OR  paste into Supabase SQL Editor

-- ---------------------------------------------------------------------------
-- EXTENSIONS & ENUMS
-- ---------------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
  CREATE TYPE job_status AS ENUM ('open', 'claimed', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE wallet_tx_type AS ENUM ('claim_fee', 'top_up', 'payout', 'refund');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- RESIDENTS (demand — device_id auth, no auth.users)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS residents (
  device_id           TEXT PRIMARY KEY,
  full_name           TEXT,
  phone               TEXT,
  address_line        TEXT,
  area                TEXT NOT NULL DEFAULT 'Amamoma',
  city                TEXT NOT NULL DEFAULT 'Cape Coast',
  location_lat        NUMERIC,
  location_lng        NUMERIC,
  onboarding_complete BOOLEAN NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_residents_onboarding ON residents (onboarding_complete);

-- ---------------------------------------------------------------------------
-- DRIVERS (supply — Supabase phone OTP → auth.users.id)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS drivers (
  id           UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  phone        TEXT UNIQUE NOT NULL,
  full_name    TEXT,
  vehicle_type TEXT,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  current_lat  NUMERIC,
  current_lng  NUMERIC,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_drivers_phone ON drivers (phone);

-- ---------------------------------------------------------------------------
-- DRIVER WALLETS (must exist before auth trigger)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS driver_wallets (
  driver_id  UUID PRIMARY KEY REFERENCES drivers (id) ON DELETE CASCADE,
  balance    NUMERIC NOT NULL DEFAULT 0.00 CHECK (balance >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- PICKUP REQUESTS
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS pickup_requests (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resident_device_id TEXT NOT NULL REFERENCES residents (device_id) ON DELETE CASCADE,
  driver_id          UUID REFERENCES drivers (id) ON DELETE SET NULL,
  photo_url          TEXT NOT NULL,
  proposed_price     NUMERIC NOT NULL CHECK (proposed_price > 0),
  location_lat       NUMERIC NOT NULL,
  location_lng       NUMERIC NOT NULL,
  address_text       TEXT,
  status             job_status NOT NULL DEFAULT 'open',
  claimed_at         TIMESTAMPTZ,
  completed_at       TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT open_jobs_have_no_driver CHECK (status != 'open' OR driver_id IS NULL),
  CONSTRAINT claimed_jobs_have_driver CHECK (
    status NOT IN ('claimed', 'completed') OR driver_id IS NOT NULL
  )
);

CREATE INDEX IF NOT EXISTS idx_pickup_status ON pickup_requests (status);
CREATE INDEX IF NOT EXISTS idx_pickup_open_geo ON pickup_requests (location_lat, location_lng)
  WHERE status = 'open';
CREATE INDEX IF NOT EXISTS idx_pickup_resident ON pickup_requests (resident_device_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pickup_driver ON pickup_requests (driver_id, created_at DESC)
  WHERE driver_id IS NOT NULL;

-- ---------------------------------------------------------------------------
-- WALLET TRANSACTIONS (audit ledger)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS wallet_transactions (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id         UUID NOT NULL REFERENCES drivers (id) ON DELETE CASCADE,
  amount            NUMERIC NOT NULL,
  type              wallet_tx_type NOT NULL,
  pickup_request_id UUID REFERENCES pickup_requests (id) ON DELETE SET NULL,
  note              TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wallet_tx_driver ON wallet_transactions (driver_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- UPDATED_AT HELPER
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS residents_updated_at ON residents;
CREATE TRIGGER residents_updated_at
  BEFORE UPDATE ON residents
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS drivers_updated_at ON drivers;
CREATE TRIGGER drivers_updated_at
  BEFORE UPDATE ON drivers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS pickup_requests_updated_at ON pickup_requests;
CREATE TRIGGER pickup_requests_updated_at
  BEFORE UPDATE ON pickup_requests
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- AUTH HOOK: auto-create driver + wallet on phone signup
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION handle_new_driver()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO drivers (id, phone)
  VALUES (NEW.id, COALESCE(NEW.phone, ''))
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO driver_wallets (driver_id, balance)
  VALUES (NEW.id, 0.00)
  ON CONFLICT (driver_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_driver ON auth.users;
CREATE TRIGGER on_auth_user_created_driver
  AFTER INSERT ON auth.users
  FOR EACH ROW
  WHEN (NEW.phone IS NOT NULL)
  EXECUTE FUNCTION handle_new_driver();

-- ---------------------------------------------------------------------------
-- RPC: atomic claim + GHS 0.50 fee
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION claim_pickup_job(job_id UUID, claiming_driver_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_balance NUMERIC;
  affected_rows   INT;
BEGIN
  SELECT balance INTO current_balance
  FROM driver_wallets
  WHERE driver_id = claiming_driver_id
  FOR UPDATE;

  IF current_balance IS NULL THEN
    RAISE EXCEPTION 'Driver wallet not found.';
  END IF;

  IF current_balance < 0.5 THEN
    RAISE EXCEPTION 'Insufficient wallet balance. Please top up.';
  END IF;

  UPDATE pickup_requests
  SET driver_id = claiming_driver_id, status = 'claimed', claimed_at = NOW(), updated_at = NOW()
  WHERE id = job_id AND status = 'open';

  GET DIAGNOSTICS affected_rows = ROW_COUNT;

  IF affected_rows = 1 THEN
    UPDATE driver_wallets
    SET balance = balance - 0.5, updated_at = NOW()
    WHERE driver_id = claiming_driver_id;

    INSERT INTO wallet_transactions (driver_id, amount, type, pickup_request_id, note)
    VALUES (claiming_driver_id, -0.5, 'claim_fee', job_id, 'Platform fee on job claim');

    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------------------------------------------------------------------------
-- RPC: complete job
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION complete_pickup_job(job_id UUID, completing_driver_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  affected_rows INT;
BEGIN
  UPDATE pickup_requests
  SET status = 'completed', completed_at = NOW(), updated_at = NOW()
  WHERE id = job_id AND driver_id = completing_driver_id AND status = 'claimed';

  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  RETURN affected_rows = 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------------------------------------------------------------------------
-- RPC: wallet top-up (hackathon stub)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION top_up_driver_wallet(target_driver_id UUID, top_up_amount NUMERIC)
RETURNS NUMERIC AS $$
DECLARE
  new_balance NUMERIC;
BEGIN
  IF top_up_amount <= 0 THEN
    RAISE EXCEPTION 'Top-up amount must be positive.';
  END IF;

  UPDATE driver_wallets
  SET balance = balance + top_up_amount, updated_at = NOW()
  WHERE driver_id = target_driver_id
  RETURNING balance INTO new_balance;

  INSERT INTO wallet_transactions (driver_id, amount, type, note)
  VALUES (target_driver_id, top_up_amount, 'top_up', 'Manual top-up');

  RETURN new_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ---------------------------------------------------------------------------

ALTER TABLE residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pickup_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "residents_public_upsert" ON residents;
CREATE POLICY "residents_public_upsert" ON residents FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "drivers_read_own" ON drivers;
CREATE POLICY "drivers_read_own" ON drivers FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "drivers_update_own" ON drivers;
CREATE POLICY "drivers_update_own" ON drivers FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "wallets_read_own" ON driver_wallets;
CREATE POLICY "wallets_read_own" ON driver_wallets FOR SELECT USING (auth.uid() = driver_id);

DROP POLICY IF EXISTS "wallet_tx_read_own" ON wallet_transactions;
CREATE POLICY "wallet_tx_read_own" ON wallet_transactions FOR SELECT USING (auth.uid() = driver_id);

DROP POLICY IF EXISTS "pickup_read_all_authenticated" ON pickup_requests;
CREATE POLICY "pickup_read_all_authenticated" ON pickup_requests FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "pickup_read_open_anon" ON pickup_requests;
CREATE POLICY "pickup_read_open_anon" ON pickup_requests FOR SELECT TO anon USING (status = 'open');

DROP POLICY IF EXISTS "pickup_insert_resident" ON pickup_requests;
CREATE POLICY "pickup_insert_resident" ON pickup_requests FOR INSERT TO anon, authenticated WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- HEATMAP VIEW (Mapbox GeoJSON source)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE VIEW open_pickups_geojson AS
SELECT
  id,
  location_lat AS lat,
  location_lng AS lng,
  proposed_price,
  photo_url,
  address_text,
  created_at
FROM pickup_requests
WHERE status = 'open';

-- Enable realtime: Dashboard → Database → Replication → pickup_requests

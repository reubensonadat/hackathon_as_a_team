import { Link } from 'react-router-dom'
import { WalletIcon } from '@heroicons/react/24/outline'
import { AppShell } from '@/components/layout/AppShell'
import { BottomNav } from '@/components/layout/BottomNav'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { IconBox } from '@/components/ui/IconBox'
import { COLLECTOR_NAV } from '@/lib/constants'
import { formatGhs } from '@/lib/utils'

export default function CollectorAccountPage() {
  const phone = sessionStorage.getItem('borlaboard_driver_phone') ?? '—'

  function handleLogout() {
    localStorage.removeItem('borlaboard_role')
    sessionStorage.removeItem('borlaboard_driver_phone')
  }

  return (
    <>
      <AppShell>
        <div className="mb-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-foreground-muted)]">
            Collector
          </p>
          <h1 className="mt-1 text-3xl font-black">Account</h1>
        </div>

        <Card className="space-y-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--color-foreground-muted)]">
              Phone
            </p>
            <p className="text-lg font-black">{phone}</p>
          </div>
          <div className="flex items-center gap-3">
            <IconBox icon={WalletIcon} variant="accent" />
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--color-foreground-muted)]">
                Wallet balance
              </p>
              <p className="text-lg font-black text-[var(--color-accent)]">{formatGhs(0)}</p>
              <p className="text-xs font-medium text-[var(--color-foreground-muted)]">
                Top-up wired in next pass
              </p>
            </div>
          </div>
        </Card>

        <div className="mt-4 space-y-3">
          <Button variant="ghost" fullWidth>
            Top up wallet
          </Button>
          <Link to="/" onClick={handleLogout}>
            <Button variant="secondary" fullWidth>
              Log out
            </Button>
          </Link>
        </div>
      </AppShell>
      <BottomNav items={COLLECTOR_NAV} />
    </>
  )
}

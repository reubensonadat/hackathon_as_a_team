import { Link } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { BottomNav } from '@/components/layout/BottomNav'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CLIENT_NAV } from '@/lib/constants'
import { getDeviceId } from '@/lib/deviceId'

export default function ClientAccountPage() {
  const deviceId = getDeviceId()
  const name = localStorage.getItem('borlaboard_profile_name') ?? '—'
  const address = localStorage.getItem('borlaboard_residential_address') ?? '—'

  function handleSwitchRole() {
    localStorage.removeItem('borlaboard_role')
  }

  return (
    <>
      <AppShell>
        <div className="mb-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-foreground-muted)]">
            Account
          </p>
          <h1 className="mt-1 text-3xl font-black">Profile</h1>
        </div>

        <Card className="space-y-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--color-foreground-muted)]">
              Name
            </p>
            <p className="text-lg font-black">{name}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--color-foreground-muted)]">
              Address
            </p>
            <p className="text-lg font-black">{address}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--color-foreground-muted)]">
              Device ID
            </p>
            <p className="break-all text-xs font-medium text-[var(--color-foreground-muted)]">
              {deviceId ?? 'Not set'}
            </p>
          </div>
        </Card>

        <div className="mt-4">
          <Link to="/auth/phone" onClick={handleSwitchRole}>
            <Button variant="secondary" fullWidth>
              Switch to collector login
            </Button>
          </Link>
        </div>
      </AppShell>
      <BottomNav items={CLIENT_NAV} />
    </>
  )
}

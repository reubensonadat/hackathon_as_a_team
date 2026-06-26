import { Link } from 'react-router-dom'
import { CameraIcon } from '@heroicons/react/24/outline'
import { AppShell } from '@/components/layout/AppShell'
import { BottomNav } from '@/components/layout/BottomNav'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { IconBox } from '@/components/ui/IconBox'
import { WasteBinIcon } from '@/components/icons'
import { CLIENT_NAV } from '@/lib/constants'
import { hapticTap } from '@/lib/utils'

export default function ClientHomePage() {
  const name = localStorage.getItem('borlaboard_profile_name') ?? 'Resident'

  return (
    <>
      <AppShell>
        <div className="mb-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-foreground-muted)]">
            Welcome back
          </p>
          <h1 className="mt-1 text-3xl font-black">{name}</h1>
        </div>

        <Card className="space-y-4">
          <div className="flex items-center gap-3">
            <IconBox icon={WasteBinIcon} variant="accent" />
            <div>
              <Card.Title>Request pickup</Card.Title>
              <p className="text-sm font-medium text-[var(--color-foreground-muted)]">
                Snap your waste, set a price, post a job.
              </p>
            </div>
          </div>
          <div className="flex aspect-video items-center justify-center rounded-[18px] bg-[var(--color-surface-muted)]">
            <div className="text-center">
              <CameraIcon className="mx-auto h-8 w-8 text-[var(--color-foreground-muted)]" />
              <span className="mt-2 block text-xs font-medium text-[var(--color-foreground-muted)]">
                Photo upload — wired next
              </span>
            </div>
          </div>
          <Button
            fullWidth
            onClick={() => hapticTap()}
          >
            Request Pickup
          </Button>
        </Card>

        <Card className="mt-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--color-foreground-muted)]">
            Active job
          </p>
          <p className="mt-1 text-sm font-medium text-[var(--color-foreground-muted)]">
            No active request yet.
          </p>
          <Link
            to="/client/track"
            className="mt-3 inline-block text-xs font-black text-[var(--color-accent)]"
          >
            Go to Track →
          </Link>
        </Card>
      </AppShell>
      <BottomNav items={CLIENT_NAV} />
    </>
  )
}

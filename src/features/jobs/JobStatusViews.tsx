import type { JobStatus } from '@/types'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Card } from '@/components/ui/Card'
import { formatGhs } from '@/lib/utils'

interface JobStatusViewsProps {
  status: JobStatus
  proposedPrice?: number
  addressText?: string
  role: 'resident' | 'driver'
}

export function JobStatusViews({
  status,
  proposedPrice,
  addressText,
  role,
}: JobStatusViewsProps) {
  if (status === 'claimed') {
    return (
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--color-foreground-muted)]">
              {role === 'resident' ? 'Pickup accepted' : 'Job accepted'}
            </p>
            <p className="mt-1 text-lg font-black">
              {role === 'resident'
                ? 'A collector is on the way'
                : 'Navigate to pickup location'}
            </p>
            {addressText && (
              <p className="mt-2 text-sm font-medium text-[var(--color-foreground-muted)]">
                {addressText}
              </p>
            )}
          </div>
          <StatusBadge status="claimed" />
        </div>
        {proposedPrice != null && (
          <p className="mt-4 text-xs font-medium text-[var(--color-foreground-muted)]">
            Price <span className="text-lg font-black">{formatGhs(proposedPrice)}</span>
          </p>
        )}
      </Card>
    )
  }

  if (status === 'completed') {
    return (
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--color-foreground-muted)]">
              All done
            </p>
            <p className="mt-1 text-lg font-black">Pickup completed</p>
          </div>
          <StatusBadge status="completed" />
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--color-foreground-muted)]">
            Waiting
          </p>
          <p className="mt-1 text-lg font-black">
            {role === 'resident' ? 'Looking for a collector' : 'Job available to claim'}
          </p>
        </div>
        <StatusBadge status="open" />
      </div>
    </Card>
  )
}

import { PhotoIcon } from '@heroicons/react/24/outline'
import { BottomSheet } from '@/components/layout/BottomSheet'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PLATFORM_CLAIM_FEE } from '@/lib/constants'
import { formatGhs } from '@/lib/utils'
import type { PickupRequest } from '@/types'

interface JobDetailSheetProps {
  job: PickupRequest | null
  onClose: () => void
}

export function JobDetailSheet({ job, onClose }: JobDetailSheetProps) {
  return (
    <BottomSheet open={Boolean(job)} onClose={onClose} title="Job details">
      {job && (
        <div className="space-y-4">
          <div className="flex aspect-video items-center justify-center rounded-[18px] bg-[var(--color-surface-muted)]">
            <PhotoIcon className="h-10 w-10 text-[var(--color-foreground-muted)]" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--color-foreground-muted)]">
                Proposed price
              </p>
              <p className="text-2xl font-black">{formatGhs(job.proposedPrice)}</p>
            </div>
            <StatusBadge status={job.status} />
          </div>
          <p className="text-sm font-medium text-[var(--color-foreground-muted)]">{job.addressText}</p>
          <Button fullWidth disabled title="Wire to claim_pickup_job RPC">
            Claim job ({formatGhs(PLATFORM_CLAIM_FEE)} fee)
          </Button>
        </div>
      )}
    </BottomSheet>
  )
}

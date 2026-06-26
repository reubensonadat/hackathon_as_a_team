import type { JobStatus } from '@/types'
import { Badge } from '@/components/ui/Badge'

const STATUS_VARIANT: Record<JobStatus, 'open' | 'claimed' | 'completed' | 'cancelled'> = {
  open: 'open',
  claimed: 'claimed',
  completed: 'completed',
  cancelled: 'cancelled',
}

const STATUS_LABELS: Record<JobStatus, string> = {
  open: 'Open',
  claimed: 'Accepted',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

interface StatusBadgeProps {
  status: JobStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABELS[status]}</Badge>
}

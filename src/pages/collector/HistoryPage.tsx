import { AppShell } from '@/components/layout/AppShell'
import { BottomNav } from '@/components/layout/BottomNav'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import { COLLECTOR_NAV } from '@/lib/constants'
import { formatGhs } from '@/lib/utils'
import type { JobStatus } from '@/types'

const HISTORY: { id: string; address: string; price: number; status: JobStatus }[] = [
  { id: 'h1', address: 'Amamoma junction', price: 12, status: 'completed' },
  { id: 'h2', address: 'Cape Coast road', price: 18, status: 'completed' },
  { id: 'h3', address: 'Kwaprow', price: 15, status: 'claimed' },
]

export default function CollectorHistoryPage() {
  const hasHistory = HISTORY.length > 0

  return (
    <>
      <AppShell>
        <div className="mb-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-foreground-muted)]">
            Past jobs
          </p>
          <h1 className="mt-1 text-3xl font-black">History</h1>
        </div>

        {!hasHistory ? (
          <EmptyState
            icon={ClipboardDocumentListIcon}
            title="No completed jobs yet"
            description="Jobs you accept and finish will show up here."
          />
        ) : (
          <div className="space-y-3">
            {HISTORY.map((item) => (
              <Card key={item.id} className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-[var(--color-foreground-muted)]">
                    {item.address}
                  </p>
                  <p className="text-lg font-black">{formatGhs(item.price)}</p>
                </div>
                <StatusBadge status={item.status} />
              </Card>
            ))}
          </div>
        )}
      </AppShell>
      <BottomNav items={COLLECTOR_NAV} />
    </>
  )
}

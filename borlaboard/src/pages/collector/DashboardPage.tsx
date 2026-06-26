import { useState } from 'react'
import { BottomNav } from '@/components/layout/BottomNav'
import { MapPlaceholder } from '@/components/layout/MapPlaceholder'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { JobDetailSheet } from '@/features/collector/JobDetailSheet'
import { HeatmapPulseIcon } from '@/components/icons'
import { COLLECTOR_NAV, PLATFORM_CLAIM_FEE } from '@/lib/constants'
import { formatGhs } from '@/lib/utils'
import type { PickupRequest } from '@/types'

const MOCK_JOBS: PickupRequest[] = [
  {
    id: '1',
    residentDeviceId: 'dev-1',
    photoUrl: '',
    proposedPrice: 12,
    locationLat: 5.1053,
    locationLng: -1.2466,
    addressText: 'Amamoma junction',
    status: 'open',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    residentDeviceId: 'dev-2',
    photoUrl: '',
    proposedPrice: 20,
    locationLat: 5.112,
    locationLng: -1.25,
    addressText: 'Cape Coast campus road',
    status: 'open',
    createdAt: new Date().toISOString(),
  },
]

const FILTERS = ['All', 'Nearby', 'High price', 'Recent'] as const

export default function CollectorDashboardPage() {
  const [jobs] = useState(MOCK_JOBS)
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>('All')
  const [selectedJob, setSelectedJob] = useState<PickupRequest | null>(null)

  return (
    <div className="relative min-h-full">
      <MapPlaceholder
        label="Mapbox heatmap — open jobs cluster"
        icon={HeatmapPulseIcon}
      />

      <div className="relative z-10 mx-auto max-w-lg px-4 pb-44 pt-6">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-foreground-muted)]">
              Available jobs
            </p>
            <h1 className="mt-1 text-2xl font-black">Dashboard</h1>
          </div>
          <Badge variant="accent">{jobs.length} open</Badge>
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-black ${
                activeFilter === f
                  ? 'bg-neutral-900 text-white'
                  : 'bg-[var(--color-surface)] text-[var(--color-foreground-muted)] shadow-[var(--shadow-soft)]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {jobs.map((job) => (
            <button
              key={job.id}
              type="button"
              onClick={() => setSelectedJob(job)}
              className="w-full text-left"
            >
              <Card variant="interactive" className="flex gap-4">
                <div className="h-16 w-16 shrink-0 rounded-[14px] bg-[var(--color-surface-muted)]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-[var(--color-foreground-muted)]">
                    {job.addressText}
                  </p>
                  <p className="text-lg font-black">{formatGhs(job.proposedPrice)}</p>
                  <p className="text-xs font-semibold text-[var(--color-accent)]">
                    Tap to view & claim · {formatGhs(PLATFORM_CLAIM_FEE)} fee
                  </p>
                </div>
              </Card>
            </button>
          ))}
        </div>
      </div>

      <JobDetailSheet job={selectedJob} onClose={() => setSelectedJob(null)} />
      <BottomNav items={COLLECTOR_NAV} />
    </div>
  )
}

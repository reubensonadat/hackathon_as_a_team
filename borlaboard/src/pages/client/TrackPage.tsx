import { useState } from 'react'
import { BottomNav } from '@/components/layout/BottomNav'
import { MapPlaceholder } from '@/components/layout/MapPlaceholder'
import { JobStatusViews } from '@/features/jobs/JobStatusViews'
import { CLIENT_NAV } from '@/lib/constants'
import type { JobStatus } from '@/types'

const DEMO_STATUSES: JobStatus[] = ['open', 'claimed', 'completed']

export default function ClientTrackPage() {
  const [demoStatus, setDemoStatus] = useState<JobStatus>('open')

  return (
    <div className="relative min-h-full">
      <MapPlaceholder label="Track map — live driver route (Google Directions)" />
      <div className="relative z-10 mx-auto max-w-lg px-4 pb-28 pt-6">
        <div className="mb-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-foreground-muted)]">
            Track pickup
          </p>
          <h1 className="mt-1 text-2xl font-black">Live status</h1>
        </div>

        <div className="mb-4 flex gap-2">
          {DEMO_STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setDemoStatus(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-black capitalize ${
                demoStatus === s
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'bg-[var(--color-surface)] text-[var(--color-foreground-muted)] shadow-[var(--shadow-soft)]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <JobStatusViews
          status={demoStatus}
          proposedPrice={15}
          addressText="Amamoma, Cape Coast"
          role="resident"
        />
      </div>
      <BottomNav items={CLIENT_NAV} />
    </div>
  )
}

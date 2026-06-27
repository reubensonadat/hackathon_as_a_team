import { useState } from 'react'
import { BottomNav } from '@/components/layout/BottomNav'
import { MapPlaceholder } from '@/components/layout/MapPlaceholder'
import { Card } from '@/components/ui/Card'
import { COLLECTOR_NAV } from '@/lib/constants'
import { hapticTap } from '@/lib/utils'
import { JobDetailSheet } from '@/features/collector/JobDetailSheet'
import { HeatmapPulseIcon } from '@/components/icons'
import type { PickupRequest } from '@/types'
import { MapPinIcon, BoltIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

// Extended type for mock visualization
interface MockPickupJob extends PickupRequest {
  distance: string
  priority: 'High Priority' | 'Standard'
  binsInfo: string
  spillages: boolean
}

const MOCK_JOBS: MockPickupJob[] = [
  {
    id: 'REQ-4819',
    residentDeviceId: 'dev-1',
    photoUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=150&q=80',
    proposedPrice: 45,
    locationLat: 5.1053,
    locationLng: -1.2466,
    addressText: 'House A24, Amamoma Road',
    status: 'open',
    createdAt: new Date().toISOString(),
    distance: '0.3 km away',
    priority: 'High Priority',
    binsInfo: '2x Large Bin, 1x Standard Bin',
    spillages: true
  },
  {
    id: 'REQ-8812',
    residentDeviceId: 'dev-2',
    photoUrl: '',
    proposedPrice: 15,
    locationLat: 5.112,
    locationLng: -1.25,
    addressText: 'Hostel Royale, Kwaprow',
    status: 'open',
    createdAt: new Date().toISOString(),
    distance: '1.1 km away',
    priority: 'Standard',
    binsInfo: '1x Standard Bin',
    spillages: false
  },
  {
    id: 'REQ-3109',
    residentDeviceId: 'dev-3',
    photoUrl: '',
    proposedPrice: 35,
    locationLat: 5.108,
    locationLng: -1.248,
    addressText: 'Cape Coast - UCC Science Area',
    status: 'open',
    createdAt: new Date().toISOString(),
    distance: '0.8 km away',
    priority: 'High Priority',
    binsInfo: '1x Commercial Bin',
    spillages: false
  }
]

const FILTERS = ['All Jobs', 'High Priority', 'Nearby (< 1km)'] as const

export default function CollectorDashboardPage() {
  const [jobs, setJobs] = useState<MockPickupJob[]>(MOCK_JOBS)
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>('All Jobs')
  const [selectedJob, setSelectedJob] = useState<PickupRequest | null>(null)
  const [claimedJobId, setClaimedJobId] = useState<string | null>(null)

  const handleFilterChange = (filter: typeof FILTERS[number]) => {
    hapticTap()
    setActiveFilter(filter)
  }

  const handleClaimJob = (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation()
    hapticTap()
    setClaimedJobId(jobId)
    
    // Simulate claim success
    setTimeout(() => {
      setJobs(prev => prev.filter(j => j.id !== jobId))
      setClaimedJobId(null)
    }, 1500)
  }

  const filteredJobs = jobs.filter(job => {
    if (activeFilter === 'High Priority') return job.priority === 'High Priority'
    if (activeFilter === 'Nearby (< 1km)') {
      const dist = parseFloat(job.distance)
      return dist < 1.0
    }
    return true
  })

  return (
    <div className="relative min-h-[100dvh] bg-neutral-900 overflow-hidden">
      {/* Background Live Map with dark styling to feel premium */}
      <div className="absolute inset-0 z-0 opacity-40">
        <MapPlaceholder
          label="Live Open Jobs Map - Cape Coast Area"
          icon={HeatmapPulseIcon}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-lg px-4 pb-36 pt-6 flex flex-col min-h-[100dvh]">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-end justify-between bg-neutral-950/80 backdrop-blur-md -mx-4 px-4 py-4 border-b border-white/5"
        >
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">
              COMMUNITY COLLECTOR
            </p>
            <h1 className="mt-1 text-2xl font-black text-white">Available jobs</h1>
          </div>
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
            {jobs.length} open
          </span>
        </motion.div>

        {/* Filter Pills */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none"
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => handleFilterChange(f)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-black transition-all cursor-pointer ${
                activeFilter === f
                  ? 'bg-[var(--color-primary)] text-white shadow-md'
                  : 'bg-neutral-800/90 text-neutral-300 hover:text-white border border-white/5'
              }`}
            >
              {f}
            </button>
          ))}
        </motion.div>

        {/* Job Cards */}
        <div className="space-y-4 flex-1 overflow-y-auto scrollbar-none">
          <AnimatePresence mode="popLayout">
            {filteredJobs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center"
              >
                <div className="mx-auto w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mb-3">
                  <MapPinIcon className="h-6 w-6 text-neutral-500" />
                </div>
                <p className="text-sm font-bold text-neutral-400">No matching jobs found</p>
                <p className="text-xs text-neutral-500 mt-1">Try changing the active filter</p>
              </motion.div>
            ) : (
              filteredJobs.map((job, idx) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                  onClick={() => setSelectedJob(job)}
                  className="w-full text-left cursor-pointer"
                >
                  <Card 
                    variant="interactive" 
                    padding="none"
                    className="flex flex-col bg-neutral-950/95 border-neutral-800 text-white overflow-hidden shadow-lg hover:border-emerald-500/30 group"
                  >
                    <div className="flex gap-4 p-4">
                      {/* Job Image or Icon */}
                      <div className="h-16 w-16 shrink-0 rounded-[14px] overflow-hidden bg-neutral-900 border border-white/5 flex items-center justify-center">
                        {job.photoUrl ? (
                          <img src={job.photoUrl} alt="Bin" className="h-full w-full object-cover" />
                        ) : (
                          <svg className="h-7 w-7 text-neutral-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 4h-3V2.5A1.5 1.5 0 0014.5 1h-5A1.5 1.5 0 008 2.5V4H5a1 1 0 00-1 1v14a4 4 0 004 4h8a4 4 0 004-4V5a1 1 0 00-1-1zM10 3h4v1h-4V3zm7 16a2 2 0 01-2 2H9a2 2 0 01-2-2V6h10v13z" />
                          </svg>
                        )}
                      </div>
                      
                      {/* Info */}
                      <div className="min-w-0 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-neutral-400 tracking-wider">
                              {job.id}
                            </span>
                            <span className={`inline-flex items-center gap-0.5 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              job.priority === 'High Priority'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-neutral-800 text-neutral-400'
                            }`}>
                              {job.priority === 'High Priority' && <BoltIcon className="h-2.5 w-2.5" />}
                              {job.priority}
                            </span>
                          </div>
                          
                          <p className="truncate text-sm font-black mt-1.5 text-neutral-100 group-hover:text-emerald-400 transition-colors">
                            {job.addressText}
                          </p>
                          <p className="text-[11px] font-medium text-neutral-400 mt-0.5">
                            {job.binsInfo} {job.spillages && '• Spillage Present'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Section */}
                    <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-t border-neutral-800">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs font-bold text-neutral-400">Payout:</span>
                        <span className="text-lg font-black text-emerald-400">GHS {job.proposedPrice.toFixed(2)}</span>
                      </div>

                      <button
                        onClick={(e) => handleClaimJob(e, job.id)}
                        disabled={claimedJobId === job.id}
                        className={`min-h-[38px] px-5 rounded-lg text-xs font-black cursor-pointer tracking-wider active:scale-[0.97] transition-all flex items-center justify-center gap-1.5 ${
                          claimedJobId === job.id
                            ? 'bg-neutral-800 text-neutral-400'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/20'
                        }`}
                      >
                        {claimedJobId === job.id ? (
                          <>
                            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-neutral-400 border-t-transparent" />
                            CLAIMING...
                          </>
                        ) : (
                          <>
                            <CheckCircleIcon className="h-4 w-4" />
                            CLAIM JOB
                          </>
                        )}
                      </button>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      <JobDetailSheet job={selectedJob} onClose={() => setSelectedJob(null)} />
      <BottomNav items={COLLECTOR_NAV} />
    </div>
  )
}

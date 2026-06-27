import { useState } from 'react'
import { BottomNav } from '@/components/layout/BottomNav'
import { Map, MapMarker, MarkerContent } from '@/components/ui/map'
import { Card } from '@/components/ui/Card'
import { COLLECTOR_NAV } from '@/lib/constants'
import { hapticTap } from '@/lib/utils'
import { JobDetailSheet } from '@/features/collector/JobDetailSheet'
import type { PickupRequest } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

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
    proposedPrice: 45.0,
    locationLat: 5.1053,
    locationLng: -1.2466,
    addressText: 'House A24, Amamoma',
    status: 'open',
    createdAt: new Date().toISOString(),
    distance: '0.3 km',
    priority: 'High Priority',
    binsInfo: '2x Large Bin, 1x Standard Bin',
    spillages: true
  },
  {
    id: 'REQ-8812',
    residentDeviceId: 'dev-2',
    photoUrl: '',
    proposedPrice: 15.0,
    locationLat: 5.112,
    locationLng: -1.25,
    addressText: 'Hostel Royale',
    status: 'open',
    createdAt: new Date().toISOString(),
    distance: '1.1 km',
    priority: 'Standard',
    binsInfo: '1x Standard Bin',
    spillages: false
  },
  {
    id: 'REQ-3109',
    residentDeviceId: 'dev-3',
    photoUrl: '',
    proposedPrice: 35.0,
    locationLat: 5.108,
    locationLng: -1.248,
    addressText: 'UCC Science Area',
    status: 'open',
    createdAt: new Date().toISOString(),
    distance: '0.8 km',
    priority: 'High Priority',
    binsInfo: '1x Commercial Bin',
    spillages: false
  }
]

const FILTERS = ['All', 'High Priority', 'Nearby'] as const

export default function CollectorDashboardPage() {
  const [jobs, setJobs] = useState<MockPickupJob[]>(MOCK_JOBS)
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>('All')
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
    
    setTimeout(() => {
      setJobs(prev => prev.filter(j => j.id !== jobId))
      setClaimedJobId(null)
    }, 1500)
  }

  const filteredJobs = jobs.filter(job => {
    if (activeFilter === 'High Priority') return job.priority === 'High Priority'
    if (activeFilter === 'Nearby') {
      const dist = parseFloat(job.distance)
      return dist < 1.0
    }
    return true
  })

  return (
    <div className="relative min-h-[100dvh] bg-[#F9FAFB] overflow-hidden font-sans pb-32">
      
      <div className="relative z-10 mx-auto max-w-lg px-4 pt-6 flex flex-col min-h-[100dvh]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-2">
          <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-neutral-200 flex items-center justify-center">
            <ArrowRightIcon className="w-4 h-4 text-neutral-900 rotate-180" />
          </div>
          <h1 className="text-neutral-900 text-base font-bold">Available Jobs</h1>
          <div className="w-8" />
        </div>

        {/* Map Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-8 relative w-full h-[240px] rounded-[32px] overflow-hidden bg-white shadow-sm border border-neutral-100 p-1"
        >
          <div className="w-full h-full rounded-[28px] overflow-hidden relative">
            <Map
              viewport={{
                center: [-1.2466, 5.1053],
                zoom: 13
              }}
              theme="light"
              interactive={true}
            >
              {jobs.map(job => (
                <MapMarker key={job.id} longitude={job.locationLng} latitude={job.locationLat}>
                  <MarkerContent>
                    <div className="h-5 w-5 rounded-full bg-[#D4F84B] flex items-center justify-center border-2 border-white shadow-md">
                      <div className="h-1.5 w-1.5 bg-black rounded-full" />
                    </div>
                  </MarkerContent>
                </MapMarker>
              ))}
            </Map>
            <div className="absolute right-3 bottom-3 flex flex-col gap-2">
              <button className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center border border-black/5 shadow-sm">
                <span className="text-neutral-900 text-lg leading-none font-medium">+</span>
              </button>
              <button className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center border border-black/5 shadow-sm">
                <span className="text-neutral-900 text-lg leading-none font-medium">[]</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Filter Pills */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex gap-3 overflow-x-auto pb-1 scrollbar-none"
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => handleFilterChange(f)}
              className={`shrink-0 rounded-full px-6 py-2.5 text-sm transition-all cursor-pointer ${
                activeFilter === f
                  ? 'bg-[#D4F84B] text-black font-semibold shadow-sm'
                  : 'bg-white border border-neutral-200 text-neutral-600 font-medium hover:text-neutral-900'
              }`}
            >
              {f}
            </button>
          ))}
        </motion.div>

        {/* Light Mode Cards */}
        <div className="space-y-4 flex-1">
          <AnimatePresence mode="popLayout">
            {filteredJobs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center"
              >
                <p className="text-sm font-medium text-neutral-500">No jobs available right now.</p>
              </motion.div>
            ) : (
              filteredJobs.map((job, idx) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                >
                  <Card 
                    variant="interactive" 
                    padding="none"
                    className="bg-white border border-neutral-100 shadow-sm rounded-[28px] p-5 w-full cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedJob(job)}
                  >
                    {/* Top Row: ID */}
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-neutral-900 text-lg font-bold tracking-wide">{job.id}</span>
                      <span className="text-neutral-900 font-black text-lg">
                        GHS {job.proposedPrice.toFixed(2)}
                      </span>
                    </div>

                    {/* Middle Row: Locations & Dates */}
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex-1">
                        <p className="text-neutral-900 text-[15px] font-bold mb-1">{job.addressText}</p>
                        <p className="text-neutral-500 text-xs font-medium">From</p>
                      </div>
                      
                      <div className="px-4 text-neutral-300 font-light tracking-widest text-sm">
                        &gt;&gt;&gt;
                      </div>
                      
                      <div className="flex-1 text-right">
                        <p className="text-neutral-900 text-[15px] font-bold mb-1">Landfill Hub</p>
                        <p className="text-neutral-500 text-xs font-medium">{job.distance}</p>
                      </div>
                    </div>

                    {/* Bottom Row: Claim Job Button */}
                    <div className="pt-2">
                      <button 
                        onClick={(e) => handleClaimJob(e, job.id)}
                        disabled={claimedJobId === job.id}
                        className="w-full bg-[#D4F84B] hover:bg-[#cbf13c] transition-colors text-black text-sm font-bold py-3.5 rounded-2xl flex items-center justify-center"
                      >
                        {claimedJobId === job.id ? 'Claiming...' : 'Claim Job'}
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

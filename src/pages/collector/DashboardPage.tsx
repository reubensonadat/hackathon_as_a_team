import { useState, useEffect } from 'react'
import { BottomNav } from '@/components/layout/BottomNav'
import { Map, MapMarker, MarkerContent } from '@/components/ui/map'
import { Card } from '@/components/ui/Card'
import { COLLECTOR_NAV } from '@/lib/constants'
import { hapticTap } from '@/lib/utils'
import { JobDetailSheet } from '@/features/collector/JobDetailSheet'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

const FILTERS = ['All', 'High Priority', 'Nearby'] as const

export default function CollectorDashboardPage() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<any[]>([])
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>('All')
  const [selectedJob, setSelectedJob] = useState<any | null>(null)
  const [claimingJobId, setClaimingJobId] = useState<string | null>(null)

  const fetchJobs = async () => {
    if (!supabase || !user) return
    const { data } = await supabase
      .from('pickup_requests')
      .select('*')
      .in('status', ['open', 'claimed'])
      .order('created_at', { ascending: false })

    if (data) {
      // Filter out jobs claimed by OTHER drivers
      const relevantJobs = data.filter(
        (job) => job.status === 'open' || (job.status === 'claimed' && job.driver_id === user.id)
      )
      setJobs(relevantJobs)
    }
  }

  useEffect(() => {
    fetchJobs()

    if (!supabase) return
    const sub = supabase
      .channel('public:pickup_requests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pickup_requests' }, () => {
        fetchJobs()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(sub)
    }
  }, [user])

  const handleFilterChange = (filter: typeof FILTERS[number]) => {
    hapticTap()
    setActiveFilter(filter)
  }

  const handleClaimJob = async (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation()
    hapticTap()
    if (!user) return
    setClaimingJobId(jobId)
    
    try {
      const { error } = await supabase.rpc('claim_pickup_job', {
        job_id: jobId,
        claiming_driver_id: user.id
      })
      if (error) throw error
      await fetchJobs()
    } catch (err) {
      console.error(err)
      alert("Failed to claim job.")
    } finally {
      setClaimingJobId(null)
    }
  }

  const filteredJobs = jobs.filter(job => {
    if (activeFilter === 'High Priority') return job.proposed_price > 30
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
                <MapMarker key={job.id} longitude={job.location_lng} latitude={job.location_lat}>
                  <MarkerContent>
                    <div className="h-5 w-5 rounded-full bg-[#46c300] flex items-center justify-center border-2 border-white shadow-md">
                      <div className="h-1.5 w-1.5 bg-black rounded-full" />
                    </div>
                  </MarkerContent>
                </MapMarker>
              ))}
            </Map>
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
                  ? 'bg-[#46c300] text-white font-bold shadow-sm'
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
                      <span className="text-neutral-900 text-lg font-bold tracking-wide">
                        {job.id.split('-')[0]}-{job.id.slice(-4)}
                      </span>
                      <span className="text-neutral-900 font-black text-lg">
                        GHS {job.proposed_price?.toFixed(2)}
                      </span>
                    </div>

                    {/* Middle Row: Locations & Dates */}
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex-1">
                        <p className="text-neutral-900 text-[15px] font-bold mb-1">{job.address_text}</p>
                        <p className="text-neutral-500 text-xs font-medium">From</p>
                      </div>
                      
                      <div className="px-4 text-neutral-300 font-light tracking-widest text-sm">
                        &gt;&gt;&gt;
                      </div>
                      
                      <div className="flex-1 text-right">
                        <p className="text-neutral-900 text-[15px] font-bold mb-1">Landfill Hub</p>
                        <p className="text-neutral-500 text-xs font-medium">2.4 km</p>
                      </div>
                    </div>

                    {/* Bottom Row: Claim Job Button */}
                    <div className="pt-2">
                      {job.status === 'claimed' ? (
                         <button 
                         className="w-full bg-neutral-900 text-white text-sm font-bold py-3.5 rounded-2xl flex items-center justify-center shadow-sm"
                         onClick={(e) => { e.stopPropagation(); setSelectedJob(job); }}
                       >
                         Complete Job
                       </button>
                      ) : (
                        <button 
                          onClick={(e) => handleClaimJob(e, job.id)}
                          disabled={claimingJobId === job.id}
                          className="w-full bg-[#46c300] hover:bg-[#3ea900] transition-colors text-white text-sm font-bold py-3.5 rounded-2xl flex items-center justify-center shadow-sm disabled:opacity-50"
                        >
                          {claimingJobId === job.id ? 'Claiming...' : 'Claim Job'}
                        </button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      <JobDetailSheet job={selectedJob} onClose={() => { setSelectedJob(null); fetchJobs(); }} />
      <BottomNav items={COLLECTOR_NAV} />
    </div>
  )
}

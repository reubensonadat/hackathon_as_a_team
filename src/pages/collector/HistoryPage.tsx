import { useState, useEffect } from 'react'
import { BottomNav } from '@/components/layout/BottomNav'
import { Card } from '@/components/ui/Card'
import { COLLECTOR_NAV } from '@/lib/constants'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

export default function CollectorHistoryPage() {
  const { user } = useAuth()
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    async function fetchHistory() {
      if (!supabase || !user) return
      const { data } = await supabase
        .from('pickup_requests')
        .select('*')
        .eq('driver_id', user.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })

      if (data) {
        setHistory(data)
      }
    }

    fetchHistory()
  }, [user])

  const hasHistory = history.length > 0

  return (
    <div className="relative min-h-[100dvh] bg-[#F9FAFB] overflow-hidden font-sans pb-32">
      <div className="relative z-10 mx-auto max-w-lg px-4 pt-6 flex flex-col min-h-[100dvh]">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-2">
          <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-neutral-200 flex items-center justify-center">
            <ArrowLeftIcon className="w-4 h-4 text-neutral-900" />
          </div>
          <h1 className="text-neutral-900 text-base font-bold">History</h1>
          <div className="w-8" />
        </div>

        <div className="space-y-4 flex-1">
          <AnimatePresence mode="popLayout">
            {!hasHistory ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center"
              >
                <p className="text-sm font-medium text-neutral-500">No completed jobs yet.</p>
              </motion.div>
            ) : (
              history.map((job, idx) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                >
                  <Card
                    variant="interactive"
                    padding="none"
                    className="bg-white border border-neutral-100 shadow-sm rounded-[28px] p-5 w-full transition-shadow hover:shadow-md"
                  >
                    {/* Top Row: ID + Price/Detail */}
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
                        <p className="text-neutral-500 text-xs font-medium">
                          {new Date(job.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="px-4 text-neutral-300 font-light tracking-widest text-sm">
                        &gt;&gt;&gt;
                      </div>

                      <div className="flex-1 text-right">
                        <p className="text-neutral-900 text-[15px] font-bold mb-1">Landfill Hub</p>
                        <p className="text-neutral-500 text-xs font-medium">Delivered</p>
                      </div>
                    </div>

                    {/* Bottom Row: Status Indicator */}
                    <div className="border-t border-neutral-100 pt-4 flex justify-between items-center text-sm font-bold">
                      <span className="text-[#005c4b]">Completed</span>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      <BottomNav items={COLLECTOR_NAV} />
    </div>
  )
}

import { useState } from 'react'
import { PhotoIcon } from '@heroicons/react/24/outline'
import { BottomSheet } from '@/components/layout/BottomSheet'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PLATFORM_CLAIM_FEE } from '@/lib/constants'
import { formatGhs } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

interface JobDetailSheetProps {
  job: any | null
  onClose: () => void
}

export function JobDetailSheet({ job, onClose }: JobDetailSheetProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleClaim = async () => {
    if (!user || !job) return
    setLoading(true)
    try {
      const { error } = await supabase.rpc('claim_pickup_job', {
        job_id: job.id,
        claiming_driver_id: user.id
      })
      if (error) throw error
      onClose()
    } catch (err) {
      console.error(err)
      alert('Failed to claim job.')
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async () => {
    if (!user || !job) return
    setLoading(true)
    try {
      const { error } = await supabase.rpc('complete_pickup_job', {
        job_id: job.id,
        completing_driver_id: user.id
      })
      if (error) throw error
      onClose()
    } catch (err) {
      console.error(err)
      alert('Failed to complete job.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <BottomSheet open={Boolean(job)} onClose={onClose} title="Job details">
      {job && (
        <div className="space-y-4 max-h-[75vh] overflow-y-auto">
          {job.photo_url ? (
            <img 
              src={job.photo_url} 
              alt="Waste Context" 
              className="w-full aspect-video object-cover rounded-[18px] shadow-sm border border-neutral-200" 
            />
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-[18px] bg-neutral-100 border border-neutral-200">
              <PhotoIcon className="h-10 w-10 text-neutral-400" />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-500">
                Proposed price
              </p>
              <p className="text-2xl font-black">{formatGhs(job.proposed_price)}</p>
            </div>
            <StatusBadge status={job.status} />
          </div>

          <p className="text-sm font-bold text-neutral-900">{job.address_text}</p>
          
          <div className="pt-4">
            {job.status === 'open' ? (
              <Button 
                fullWidth 
                onClick={handleClaim} 
                loading={loading}
                className="bg-[#46c300] hover:bg-[#3ea900] text-white shadow-md font-bold text-[15px] py-4 rounded-xl"
              >
                CLAIM JOB ({formatGhs(PLATFORM_CLAIM_FEE)} FEE)
              </Button>
            ) : job.status === 'claimed' && job.driver_id === user?.id ? (
              <Button 
                fullWidth 
                onClick={handleComplete} 
                loading={loading}
                className="bg-neutral-900 hover:bg-black text-white shadow-md font-bold text-[15px] py-4 rounded-xl"
              >
                COMPLETE JOB
              </Button>
            ) : null}
          </div>
        </div>
      )}
    </BottomSheet>
  )
}

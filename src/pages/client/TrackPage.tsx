import { useState, useEffect } from 'react'
import { BottomNav } from '@/components/layout/BottomNav'
import { MapPlaceholder } from '@/components/layout/MapPlaceholder'
import { JobStatusViews } from '@/features/jobs/JobStatusViews'
import { CLIENT_NAV } from '@/lib/constants'
import type { JobStatus } from '@/types'
import { supabase } from '@/lib/supabase'
import { getOrCreateDeviceId } from '@/lib/deviceId'

export default function ClientTrackPage() {
  const [activeRequest, setActiveRequest] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    if (!supabase) return
    const deviceId = getOrCreateDeviceId()

    const { data: active } = await supabase
      .from('pickup_requests')
      .select('*, drivers(full_name)')
      .eq('resident_device_id', deviceId)
      .neq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (active) {
      setActiveRequest(active)
    } else {
      setActiveRequest(null)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()

    if (!supabase) return
    const deviceId = getOrCreateDeviceId()

    const sub = supabase
      .channel('public:pickup_requests')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'pickup_requests',
        filter: `resident_device_id=eq.${deviceId}`
      }, () => {
        fetchData()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(sub)
    }
  }, [])

  if (loading) {
    return (
      <div className="relative min-h-full flex items-center justify-center pb-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#46c300] border-t-transparent" />
        <BottomNav items={CLIENT_NAV} />
      </div>
    )
  }

  if (!activeRequest) {
    return (
      <div className="relative min-h-full flex flex-col items-center justify-center pb-20 px-4 text-center">
        <h2 className="text-xl font-black text-neutral-900">No active request</h2>
        <p className="text-sm font-medium text-neutral-500 mt-2">
          You don't have any active pickup requests to track right now.
        </p>
        <BottomNav items={CLIENT_NAV} />
      </div>
    )
  }

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

        <JobStatusViews
          status={activeRequest.status as JobStatus}
          proposedPrice={activeRequest.proposed_price || 15}
          addressText={activeRequest.address_text || "Your Address"}
          role="resident"
        />
      </div>
      <BottomNav items={CLIENT_NAV} />
    </div>
  )
}

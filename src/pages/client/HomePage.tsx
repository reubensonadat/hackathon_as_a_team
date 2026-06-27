import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPinIcon, Bars3Icon, UserIcon } from '@heroicons/react/24/outline'
import { AppShell } from '@/components/layout/AppShell'
import { BottomNav } from '@/components/layout/BottomNav'
import { CLIENT_NAV } from '@/lib/constants'
import { hapticTap, cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { getOrCreateDeviceId } from '@/lib/deviceId'

export default function ClientHomePage() {
  const navigate = useNavigate()
  const [activeRequest, setActiveRequest] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [binSize, setBinSize] = useState<'standard' | 'extra'>('standard')

  const area = localStorage.getItem('borlaboard_residential_area') ?? 'Not Set'

  const fetchData = async () => {
    if (!supabase) return
    const deviceId = getOrCreateDeviceId()

    // Active request
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

    // History
    const { data: past } = await supabase
      .from('pickup_requests')
      .select('*')
      .eq('resident_device_id', deviceId)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(3)

    if (past) {
      setHistory(past)
    }
  }

  useEffect(() => {
    fetchData()

    // Realtime subscription
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

  const handleRequestImmediatePickup = () => {
    hapticTap()
    navigate('/client/pickup-details')
  }

  const handleCancelRequest = async () => {
    hapticTap()
    if (!supabase || !activeRequest) return
    // Only allow cancel if open
    if (activeRequest.status === 'open') {
      await supabase.from('pickup_requests').delete().eq('id', activeRequest.id)
      setActiveRequest(null)
    } else {
      alert("Can't cancel because a driver has already claimed it.")
    }
  }

  return (
    <>
      <AppShell className="pb-32">
        {/* Top Header */}
        <motion.header 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-30 -mx-4 -mt-4 mb-6 flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 shadow-sm"
        >
          <button className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-800 active:bg-neutral-100 transition-colors">
            <Bars3Icon className="h-6 w-6 stroke-[2.25]" />
          </button>
          
          <span className="text-xl font-black uppercase tracking-[0.15em] text-neutral-900 select-none">
            CITYBINS
          </span>
          
          <Link to="/client/account" className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-neutral-300 text-neutral-500 hover:border-neutral-500 transition-colors">
            <UserIcon className="h-5 w-5" />
          </Link>
        </motion.header>

        <AnimatePresence mode="wait">
          {activeRequest ? (
            /* Active Request Dashboard Alert Card */
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              {/* Radar status card */}
              <div className="border border-neutral-200 rounded-[28px] bg-white p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-50 text-[#005c4b] border border-neutral-200">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#005c4b] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#005c4b]"></span>
                    </span>
                  </div>
                  <div>
                    <h2 className="text-base font-black text-neutral-900">Active Collection</h2>
                    <p className="text-xs font-semibold text-neutral-500 mt-0.5 font-sans">
                      {activeRequest.status === 'open' 
                        ? 'Waiting for a collector to claim your request.'
                        : `${activeRequest.drivers?.full_name || 'A driver'} is currently en route.`}
                    </p>
                  </div>
                </div>

                <hr className="border-t border-neutral-200" />

                <div className="flex items-center justify-between text-xs px-1 font-bold text-neutral-700">
                  <span>Estimated Price</span>
                  <span className="font-black text-neutral-900">{activeRequest.proposed_price ?? 15} GHS</span>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => { hapticTap(); navigate('/client/track'); }}
                    className="w-full bg-[#005c4b] hover:bg-[#004a3c] transition-colors text-white text-xs font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-sm uppercase"
                  >
                    TRACK LIVE
                  </button>
                  
                  {activeRequest.status === 'open' && (
                    <button
                      onClick={handleCancelRequest}
                      className="w-full text-center text-[10px] font-bold uppercase tracking-wider text-neutral-400 hover:text-red-650 transition-colors py-1.5 cursor-pointer"
                    >
                      CANCEL REQUEST
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            /* Normal Dashboard View */
            <motion.div
              key="normal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Current Service Area Card */}
              <div className="border border-neutral-200 bg-white p-4 rounded-[28px] shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-50 text-neutral-800 border border-neutral-200">
                    <MapPinIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                      CURRENT SERVICE AREA
                    </p>
                    <p className="text-[15px] font-black text-neutral-900 mt-0.5">{area}</p>
                  </div>
                </div>
                
                <Link
                  to="/onboarding/residential"
                  onClick={hapticTap}
                  className="text-xs font-bold uppercase tracking-wider text-neutral-900 hover:underline"
                >
                  CHANGE
                </Link>
              </div>

              {/* Giant Request Button Card */}
              <button
                onClick={handleRequestImmediatePickup}
                className="w-full bg-[#005c4b] hover:bg-[#004a3c] active:scale-[0.98] transition-all duration-100 border border-neutral-200 py-8 rounded-[28px] cursor-pointer text-center flex flex-col items-center justify-center shadow-sm"
              >
                <div className="flex items-center gap-1.5 mb-2">
                  {/* Trash Icon */}
                  <svg className="h-9 w-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7M5 7h14m-14 0h14m-9-3h4a1 1 0 011 1v2H9V4a1 1 0 011-1z" />
                  </svg>
                  {/* List Lines */}
                  <div className="flex flex-col gap-1">
                    <span className="h-[3.5px] w-4 bg-white rounded-full" />
                    <span className="h-[3.5px] w-6 bg-white rounded-full" />
                    <span className="h-[3.5px] w-4 bg-white rounded-full" />
                  </div>
                </div>
                <span className="text-2xl font-black uppercase tracking-tight text-white leading-none">
                  REQUEST<br />IMMEDIATE<br />PICKUP
                </span>
              </button>

              {/* Pickup Details Card */}
              <div className="border border-neutral-200 bg-white p-5 rounded-[28px] shadow-sm space-y-4">
                <div>
                  <h3 className="text-base font-black text-neutral-900 uppercase tracking-tight">
                    Pickup Details
                  </h3>
                  <hr className="border-t border-neutral-200 mt-2.5" />
                </div>

                {/* Bin Size Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-neutral-800">
                      Bin Size
                    </span>
                    {/* Toggle Slider Switch */}
                    <div 
                      onClick={() => {
                        hapticTap();
                        setBinSize(prev => prev === 'standard' ? 'extra' : 'standard');
                      }}
                      className="w-14 h-7 rounded-full bg-[#005c4b] relative cursor-pointer border border-neutral-900 shadow-sm"
                    >
                      <div 
                        className={cn(
                          "h-5 w-5 rounded-full bg-neutral-900 flex items-center justify-center text-white transition-all duration-200 absolute top-[2px] shadow-md border border-neutral-900",
                          binSize === 'standard' ? 'left-[3px]' : 'left-[29px]'
                        )}
                      >
                        <svg className="h-3 w-3 stroke-[3.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Slider Labels */}
                  <div className="flex justify-between items-center text-xs px-1">
                    <span className={cn(
                      "transition-colors duration-150",
                      binSize === 'standard' ? 'font-bold text-neutral-900' : 'font-medium text-neutral-400'
                    )}>
                      Standard
                    </span>
                    <span className={cn(
                      "transition-colors duration-150",
                      binSize === 'extra' ? 'font-bold text-neutral-900' : 'font-medium text-neutral-400'
                    )}>
                      Extra Bags
                    </span>
                  </div>
                </div>

                {/* Estimated Fee Box */}
                <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                    ESTIMATED FEE
                  </span>
                  <span className="text-xl font-black text-neutral-900">
                    {binSize === 'standard' ? '15 GHS' : '25 GHS'}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Pickups History Section */}
        {history.length > 0 && (
          <div className="mt-8 space-y-3">
            <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-500">
              Recent Pickups
            </label>
            <div className="space-y-4">
              {history.map((item) => (
                <div 
                  key={item.id} 
                  className="border border-neutral-200 bg-white p-4 rounded-[28px] shadow-sm flex items-center justify-between gap-4"
                >
                  <div>
                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block">
                      {item.id.split('-')[0]}-{item.id.slice(-4)}
                    </span>
                    <span className="text-sm font-bold text-neutral-900 mt-1 block">
                      Collection
                    </span>
                    <span className="text-[10px] font-medium text-neutral-400 mt-0.5 block">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-neutral-900 block">
                      {item.proposed_price} GHS
                    </span>
                    <span className="inline-flex items-center gap-1 bg-neutral-150 text-neutral-705 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mt-1.5 border border-neutral-200">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </AppShell>

      {/* Bottom Nav */}
      <BottomNav items={CLIENT_NAV} />
    </>
  )
}

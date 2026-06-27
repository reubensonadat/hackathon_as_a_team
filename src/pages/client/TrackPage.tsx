import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { PhoneIcon, Bars3Icon, UserIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { BottomNav } from '@/components/layout/BottomNav'
import { CLIENT_NAV } from '@/lib/constants'
import { hapticTap } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export default function ClientTrackPage() {
  const navigate = useNavigate()
  const [activeRequest, setActiveRequest] = useState<any>(null)

  // Load active request from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('citybins_active_request')
    if (saved) {
      try {
        setActiveRequest(JSON.parse(saved))
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  const handleCancelRequest = () => {
    hapticTap()
    localStorage.removeItem('citybins_active_request')
    setActiveRequest(null)
  }

  return (
    <div className="relative min-h-screen bg-[#f8f9fa] pb-32">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <button className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-800 active:bg-neutral-100 transition-colors">
          <Bars3Icon className="h-6 w-6 stroke-[2.25]" />
        </button>
        
        <span className="text-xl font-black uppercase tracking-[0.15em] text-[#46c300] select-none">
          CITYBINS
        </span>
        
        <Link to="/client/account" className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-neutral-300 text-neutral-500 hover:border-neutral-500 transition-colors">
          <UserIcon className="h-5 w-5" />
        </Link>
      </header>



      {/* Content Section */}
      <div className="mx-auto max-w-lg px-4 pt-6">
        <AnimatePresence mode="wait">
          {activeRequest ? (
            /* Active Tracker Screen (Collector is on the way!) */
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="space-y-6"
            >
              {/* Checkmark circle badge */}
              <div className="flex justify-center mt-2">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#46c300] border-2 border-neutral-950 shadow-[4px_4px_0px_0px_#171717]">
                  <svg className="h-10 w-10 text-neutral-950 stroke-[3.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="text-center">
                <h1 className="text-2xl font-black text-neutral-900 leading-tight">Collector is on the way!</h1>
                <p className="mt-2 text-sm font-semibold text-neutral-500 max-w-[280px] mx-auto leading-relaxed">
                  Your pickup has been confirmed and the driver is en route.
                </p>
              </div>

              {/* Driver Card Info */}
              <div className="border-2 border-neutral-950 rounded-xl bg-white p-4 shadow-[4px_4px_0px_0px_#171717] space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80"
                    alt="Kwame"
                    className="h-14 w-14 rounded-full object-cover border-2 border-neutral-950 bg-neutral-100 shadow-sm"
                  />
                  <div>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      YOUR DRIVER
                    </p>
                    <p className="text-lg font-black text-neutral-900 leading-none mt-1">Kwame</p>
                    <p className="text-xs font-black text-emerald-800 flex items-center gap-1 mt-1.5">
                      <span className="text-yellow-600">★</span> 4.9 Rating
                    </p>
                  </div>
                </div>

                {/* Dashed ETA Box */}
                <div className="border-2 border-dashed border-neutral-300 rounded-lg p-3 grid grid-cols-2 text-center bg-neutral-50">
                  <div className="border-r border-neutral-200">
                    <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">
                      ETA
                    </p>
                    <p className="text-base font-black text-neutral-900 mt-0.5">12 mins</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">
                      DISTANCE
                    </p>
                    <p className="text-base font-black text-neutral-900 mt-0.5">2.4 mi</p>
                  </div>
                </div>

                {/* Truck Badge */}
                <div>
                  <span className="inline-flex items-center gap-1.5 border border-neutral-955 bg-neutral-100 text-neutral-800 text-xs font-bold px-3 py-1.5 rounded-full">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.129-1.125v-3.02M14.25 5.25v13.5m-3-13.5h3.75a1.125 1.125 0 0 1 1.125 1.125v2.25M15 8.25h3.75a1.125 1.125 0 0 1 1.125 1.125v2.25" />
                    </svg>
                    Truck #884-A
                  </span>
                </div>
              </div>

              {/* Call button */}
              <div className="pt-2">
                <a
                  href="tel:+233240000000"
                  onClick={hapticTap}
                  className="w-full shadow-[4px_4px_0px_0px_#171717] bg-[#46c300] hover:bg-[#3ea900] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[2px_2px_0px_0px_#171717] transition-all duration-100 border-2 border-neutral-950 text-neutral-950 font-black py-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PhoneIcon className="h-5 w-5 stroke-[2.5]" />
                  CALL DRIVER
                </a>
              </div>

              {/* Cancel Link */}
              <div className="text-center pt-2">
                <button
                  onClick={handleCancelRequest}
                  className="text-xs font-black uppercase tracking-wider text-neutral-500 hover:text-red-655 transition-colors cursor-pointer"
                >
                  CANCEL REQUEST
                </button>
              </div>
            </motion.div>
          ) : (
            /* Empty State */
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="text-center py-8 space-y-6"
            >
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 border-2 border-neutral-300">
                <MapPinIcon className="h-8 w-8 stroke-[1.5]" />
              </div>
              <div className="space-y-2 max-w-[280px] mx-auto">
                <h2 className="text-lg font-black text-neutral-900 uppercase tracking-tight">No Active Pickups</h2>
                <p className="text-xs font-semibold text-neutral-500 leading-relaxed">
                  You don't have any active waste collections scheduled right now.
                </p>
              </div>
              <div>
                <button
                  onClick={() => { hapticTap(); navigate('/client/pickup-details'); }}
                  className="w-full shadow-[4px_4px_0px_0px_#171717] bg-[#46c300] hover:bg-[#3ea900] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[2px_2px_0px_0px_#171717] transition-all duration-100 border-2 border-neutral-950 text-neutral-950 font-black py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  REQUEST IMMEDIATE PICKUP
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Nav */}
      <BottomNav items={CLIENT_NAV} />
    </div>
  )
}

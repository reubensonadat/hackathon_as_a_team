import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapPinIcon, Bars3Icon, UserIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { AppShell } from '@/components/layout/AppShell'
import { BottomNav } from '@/components/layout/BottomNav'
import { Card } from '@/components/ui/Card'
import { CLIENT_NAV } from '@/lib/constants'
import { hapticTap } from '@/lib/utils'
import { PickupRequestSheet } from '@/features/client/PickupRequestSheet'
import { motion, AnimatePresence } from 'framer-motion'

export default function ClientHomePage() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [activeRequest, setActiveRequest] = useState<any>(null)
  
  const name = localStorage.getItem('borlaboard_profile_name') ?? 'Resident'
  const area = localStorage.getItem('borlaboard_residential_area') ?? 'Amamoma'
  const address = localStorage.getItem('borlaboard_residential_address') ?? 'Not set'

  // Load active request from localStorage if any
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

  const handleRequestSubmit = (data: any) => {
    const newRequest = {
      ...data,
      id: 'REQ-' + Math.floor(Math.random() * 9000 + 1000),
      status: 'pending',
      timestamp: new Date().toISOString(),
      area,
      address
    }
    localStorage.setItem('citybins_active_request', JSON.stringify(newRequest))
    setActiveRequest(newRequest)
    setSheetOpen(false)
    hapticTap()
  }

  const handleCancelRequest = () => {
    hapticTap()
    localStorage.removeItem('citybins_active_request')
    setActiveRequest(null)
  }

  // Get initials for avatar
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <>
      <AppShell className="pb-32">
        {/* Top Header */}
        <motion.header 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-30 -mx-4 mb-6 flex items-center justify-between border-b border-[var(--color-border)] bg-white/80 px-4 py-3 backdrop-blur-md"
        >
          <div className="flex items-center gap-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-full text-emerald-950 active:bg-neutral-100 transition-colors">
              <Bars3Icon className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-1.5">
              <span className="h-6 w-6 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3 3 3-3m-3 3V2" />
                </svg>
              </span>
              <span className="text-lg font-black tracking-tight text-emerald-950">CityBins</span>
            </div>
          </div>
          
          <Link to="/client/account" className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold text-xs shadow-sm hover:opacity-90 transition-opacity">
            {initials || <UserIcon className="h-4.5 w-4.5" />}
          </Link>
        </motion.header>

        {/* Welcome Section */}
        <div className="mb-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-foreground-muted)]">
            Welcome back
          </p>
          <h1 className="mt-1 text-3xl font-black text-emerald-950">{name}</h1>
        </div>

        {/* Current Service Area Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-4"
        >
          <Card padding="md" className="bg-emerald-50/50 border-emerald-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-[var(--color-primary)]">
                  <MapPinIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800">
                    Current Service Area
                  </p>
                  <p className="text-sm font-black text-emerald-950">{area}</p>
                </div>
              </div>
              <span className="bg-emerald-500 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
                Active
              </span>
            </div>
          </Card>
        </motion.div>

        {/* Giant Action Button Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4"
        >
          <Card 
            variant="interactive" 
            padding="lg"
            onClick={() => { hapticTap(); setSheetOpen(true); }}
            className="bg-gradient-to-br from-emerald-600 to-emerald-800 border-none text-white relative overflow-hidden"
          >
            {/* Background elements */}
            <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
              <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 4h-3V2.5A1.5 1.5 0 0014.5 1h-5A1.5 1.5 0 008 2.5V4H5a1 1 0 00-1 1v14a4 4 0 004 4h8a4 4 0 004-4V5a1 1 0 00-1-1z" />
              </svg>
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight text-white">Request pickup</h3>
                  <p className="text-xs font-semibold text-emerald-100">
                    Snap waste, choose bin sizes, get immediate collection.
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-xl p-3">
                <span className="text-xs font-bold text-emerald-50">Standard Residential bin fee</span>
                <span className="text-sm font-black text-white">GHS 15.00</span>
              </div>

              <button
                className="w-full bg-white hover:bg-neutral-50 active:scale-[0.98] transition-transform text-emerald-950 font-black text-sm py-3.5 rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                REQUEST IMMEDIATE PICKUP
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </Card>
        </motion.div>

        {/* Active / Current Request status */}
        <AnimatePresence mode="wait">
          {activeRequest ? (
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-4"
            >
              <Card className="border-emerald-500 bg-emerald-50/10">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-950 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                      <CheckCircleIcon className="h-3 w-3 text-[var(--color-primary)]" />
                      Request Posted
                    </span>
                    <h3 className="text-sm font-black text-emerald-950 mt-2">Active Job: {activeRequest.id}</h3>
                    <p className="text-xs text-[var(--color-foreground-muted)] font-semibold mt-1">
                      {activeRequest.bins.map((b: any) => `${b.count}x ${b.type}`).join(', ')}
                      {activeRequest.spillages && ' (with spillages)'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[var(--color-foreground-muted)] font-bold">Estimated Cost</span>
                    <p className="text-base font-black text-emerald-950">
                      GHS {(activeRequest.bins.reduce((s: any, b: any) => s + (b.count * (b.type === 'Standard Bin' ? 15 : b.type === 'Large Bin' ? 25 : 50)), 0) + (activeRequest.spillages ? 10 : 0)).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2.5 mt-4 pt-4 border-t border-[var(--color-border)]">
                  <Link
                    to="/client/track"
                    className="flex-1 flex items-center justify-center gap-1.5 bg-neutral-900 hover:bg-black text-white text-xs font-black py-2.5 rounded-lg active:scale-95 transition-transform"
                  >
                    <ArrowPathIcon className="h-3.5 w-3.5 animate-spin" />
                    TRACK LIVE
                  </Link>
                  <button
                    onClick={handleCancelRequest}
                    className="px-4 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold py-2.5 rounded-lg active:scale-95 transition-transform cursor-pointer"
                  >
                    CANCEL
                  </button>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4"
            >
              <Card>
                <Card.Header>
                  <Card.Title>Active request</Card.Title>
                </Card.Header>
                <Card.Body>
                  <p className="text-xs font-semibold text-[var(--color-foreground-muted)]">
                    No active request right now. Request a pickup to see status details here.
                  </p>
                  <Link
                    to="/client/track"
                    className="mt-3 inline-block text-xs font-black text-[var(--color-primary)] hover:underline"
                  >
                    Go to Track →
                  </Link>
                </Card.Body>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </AppShell>

      {/* Bottom Nav */}
      <BottomNav items={CLIENT_NAV} />

      {/* Bottom Sheet Details */}
      <PickupRequestSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSubmit={handleRequestSubmit}
      />
    </>
  )
}

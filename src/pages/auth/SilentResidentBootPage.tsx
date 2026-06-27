import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getOrCreateDeviceId } from '@/lib/deviceId'
import { Card } from '@/components/ui/Card'

export default function SilentResidentBootPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  // Auto-redirect if already logged in and onboarded
  useEffect(() => {
    const onboardingDone = localStorage.getItem('borlaboard_onboarding_complete') === 'true'
    const role = localStorage.getItem('borlaboard_role')
    if (onboardingDone) {
      if (role === 'driver') {
        navigate('/collector/dashboard', { replace: true })
      } else {
        navigate('/client/home', { replace: true })
      }
    }
  }, [navigate])

  function handleResidentContinue() {
    setLoading(true)
    setTimeout(() => {
      getOrCreateDeviceId()
      localStorage.setItem('borlaboard_role', 'resident')
      const onboardingDone = localStorage.getItem('borlaboard_onboarding_complete') === 'true'
      if (onboardingDone) {
        navigate('/client/home')
      } else {
        navigate('/onboarding/profile')
      }
      setLoading(false)
    }, 800)
  }

  function handleDriverLogin() {
    localStorage.setItem('borlaboard_role', 'driver')
    navigate('/auth/phone')
  }

  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-between px-6 py-12 overflow-hidden bg-gradient-to-b from-emerald-50 via-[var(--color-background)] to-emerald-100/50">
      {/* Decorative ambient blobs */}
      <div className="absolute top-[-20%] left-[-20%] w-[300px] h-[300px] rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-green-400/10 blur-3xl" />

      {/* Top Section: Brand Logo */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center mt-8 z-10"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary)] shadow-lg shadow-green-900/10 mb-4">
          {/* Recycle Symbol / Bins Logo SVG */}
          <svg
            className="h-9 w-9 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3 3 3-3m-3 3V2"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-emerald-950">CityBins</h1>
        <p className="mt-1.5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">
          Smart waste networks
        </p>
      </motion.div>

      {/* Middle Section: Premium Illustration / Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm my-auto py-8 z-10"
      >
        <Card variant="elevated" className="flex flex-col items-center justify-center border-none bg-white/85 backdrop-blur-md p-6 shadow-xl rounded-[28px]">
          <div className="relative flex h-48 w-full items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-md overflow-hidden">
            {/* Visual background lines */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent scale-150" />
            
            {/* Beautiful modern vector representation of city bin */}
            <div className="relative flex flex-col items-center scale-110">
              <svg className="w-24 h-24 text-emerald-100 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                {/* Modern Bin Icon */}
                <path d="M19 4h-3V2.5A1.5 1.5 0 0014.5 1h-5A1.5 1.5 0 008 2.5V4H5a1 1 0 00-1 1v14a4 4 0 004 4h8a4 4 0 004-4V5a1 1 0 00-1-1zM10 3h4v1h-4V3zm7 16a2 2 0 01-2 2H9a2 2 0 01-2-2V6h10v13z" />
                <path d="M9 9h2v8H9zm4 0h2v8h-2z" opacity="0.8" />
              </svg>
              {/* Radiating Green Circles */}
              <div className="absolute inset-0 -m-8 rounded-full border border-white/20 animate-ping opacity-25" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-0 -m-4 rounded-full border border-white/45 animate-pulse opacity-40" />
            </div>

            {/* Float badges */}
            <span className="absolute top-4 left-4 bg-white/95 px-3 py-1 rounded-full text-[9px] font-bold text-emerald-800 uppercase tracking-widest shadow-sm">
              Live Network
            </span>
            <span className="absolute bottom-4 right-4 bg-emerald-950/40 text-emerald-100 backdrop-blur-sm px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">
              Amamoma Area
            </span>
          </div>

          <div className="mt-6 text-center">
            <h2 className="text-xl font-extrabold text-emerald-950">Cleaner neighborhoods</h2>
            <p className="mt-2 text-xs font-semibold text-emerald-800/70 max-w-[240px] leading-relaxed">
              Request instant collections, track your waste, and support local community collectors.
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Bottom Section: Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm flex flex-col gap-4 z-10"
      >
        <button
          onClick={handleResidentContinue}
          disabled={loading}
          className="flex min-h-[54px] w-full items-center justify-center gap-3 rounded-full border-none bg-emerald-600 px-5 py-3.5 text-[15px] font-black text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-700 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <span>Use App as Resident</span>
          )}
        </button>

        <button
          onClick={handleDriverLogin}
          className="flex min-h-[54px] w-full items-center justify-center gap-3 rounded-full border-2 border-emerald-200 bg-transparent px-5 py-3.5 text-[15px] font-bold text-emerald-800 hover:bg-emerald-50 active:scale-[0.98] transition-all duration-200 cursor-pointer"
        >
          <span>Sign In as Collector</span>
        </button>

        <div className="text-center">
          <p className="text-[10px] font-bold text-emerald-800/50 uppercase tracking-widest">
            By continuing, you agree to our terms
          </p>
        </div>
      </motion.div>
    </div>
  )
}


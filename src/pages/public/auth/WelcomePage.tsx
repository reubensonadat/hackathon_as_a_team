import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TrashIcon } from '@heroicons/react/24/outline'
import { getOrCreateDeviceId } from '@/lib/deviceId'

export default function WelcomePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

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
      localStorage.setItem('google_mock_name', 'Kofi Mensah')
      localStorage.setItem('google_mock_email', 'kofi.mensah@gmail.com')
      
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
    <div className="relative flex min-h-[100dvh] flex-col bg-white overflow-hidden">
      {/* Top Image Section (Rounded Square) */}
      <div className="w-full px-4 pt-4">
        <div className="relative w-full h-[40vh] min-h-[300px] rounded-[32px] overflow-hidden bg-[#2d4033] shadow-md">
          {/* Mountain Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-70 mix-blend-overlay"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&q=80&w=1000)' }}
          ></div>
          
          {/* Logo overlay inside the rounded image */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 bg-gradient-to-t from-black/40 to-transparent">
            <div className="flex items-center gap-2 text-white drop-shadow-md">
              <TrashIcon className="w-6 h-6 stroke-2" />
              <h1 className="text-xl font-black tracking-[0.15em] uppercase">Borlaboard</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col flex-1 px-6 pt-8 pb-8 justify-end">

        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white pt-8"
        >
          <h2 className="text-3xl font-black text-[#002f35] tracking-tight uppercase">Welcome</h2>
          
          <div className="mt-4 text-[#4a6b6d] font-medium leading-relaxed">
            <p>Smart waste management.</p>
            <p>Cleaner neighbourhoods.</p>
            <p>Live sustainably.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mt-8">
            <div className="flex flex-col items-center justify-center py-4 px-2 bg-white border border-emerald-100 shadow-sm rounded-xl">
              <span className="text-[#005c4b] font-bold text-lg">2,400+</span>
              <span className="text-[10px] text-[#4a6b6d] font-medium uppercase mt-1">Residents</span>
            </div>
            <div className="flex flex-col items-center justify-center py-4 px-2 bg-white border border-emerald-100 shadow-sm rounded-xl">
              <span className="text-[#008f6f] font-bold text-lg">98%</span>
              <span className="text-[10px] text-[#4a6b6d] font-medium uppercase mt-1">On-time</span>
            </div>
            <div className="flex flex-col items-center justify-center py-4 px-2 bg-white border border-emerald-100 shadow-sm rounded-xl">
              <span className="text-[#005c4b] font-bold text-lg">12T</span>
              <span className="text-[10px] text-[#4a6b6d] font-medium uppercase mt-1">CO₂ saved</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-8">
            <button
              onClick={handleResidentContinue}
              disabled={loading}
              className="w-full flex items-center justify-center py-4 rounded-xl border-2 border-[#005c4b] text-[#005c4b] font-bold text-sm tracking-widest uppercase hover:bg-emerald-50 transition-colors"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#005c4b] border-t-transparent" />
              ) : (
                'Login With Email'
              )}
            </button>
            
            {/* Merged driver login from existing code */}
            <button
              onClick={handleDriverLogin}
              className="w-full flex items-center justify-center py-4 rounded-xl border border-neutral-200 text-neutral-600 font-bold text-sm tracking-widest uppercase hover:bg-neutral-50 transition-colors"
            >
              Sign in as Collector
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm font-medium text-[#4a6b6d]">
              Don't have an account? <button onClick={handleResidentContinue} className="text-[#008f6f] font-bold hover:underline">Sign Up</button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

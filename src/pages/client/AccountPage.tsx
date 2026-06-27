import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  MapPinIcon, 
  CreditCardIcon, 
  BellIcon, 
  LanguageIcon, 
  Bars3Icon, 
  ChevronRightIcon, 
  PencilIcon 
} from '@heroicons/react/24/outline'
import { AppShell } from '@/components/layout/AppShell'
import { BottomNav } from '@/components/layout/BottomNav'
import { CLIENT_NAV } from '@/lib/constants'
import { hapticTap, cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export default function ClientAccountPage() {
  const navigate = useNavigate()
  const [pushEnabled, setPushEnabled] = useState(true)

  const name = localStorage.getItem('borlaboard_profile_name') ?? 'Marcus V.'
  const phone = localStorage.getItem('borlaboard_profile_phone') ?? '+1 (555) 0123-4567'

  const handleLogout = () => {
    hapticTap()
    localStorage.removeItem('borlaboard_role')
    localStorage.removeItem('borlaboard_onboarding_complete')
    navigate('/', { replace: true })
  }

  return (
    <>
      <AppShell className="pb-36">
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
          
          <div className="h-9 w-9 rounded-full border-2 border-neutral-300 overflow-hidden flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80" 
              alt="Profile" 
              className="h-full w-full object-cover"
            />
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* User Profile Card Block */}
          <div className="border border-neutral-200 rounded-[28px] bg-white p-6 shadow-sm flex flex-col items-center justify-center text-center">
            {/* Avatar wrapper */}
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-neutral-100 flex items-center justify-center border border-neutral-200 overflow-hidden shadow-sm">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80" 
                  alt="Avatar" 
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Pencil overlay badge */}
              <button 
                onClick={hapticTap}
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center shadow active:scale-90 transition-transform cursor-pointer"
              >
                <PencilIcon className="h-4 w-4 text-neutral-800 stroke-[2.5]" />
              </button>
            </div>

            <h2 className="text-xl font-black text-neutral-900 mt-4 leading-none">{name}</h2>
            <p className="text-xs font-semibold text-neutral-505 mt-2">{phone}</p>
          </div>

          {/* Option Menu Stack */}
          <div className="space-y-4">
            {/* Saved Addresses */}
            <div 
              onClick={hapticTap}
              className="border border-neutral-200 rounded-2xl bg-white p-4 shadow-sm flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-50 active:scale-[0.99] transition-all duration-105"
            >
              <div className="flex items-center gap-3">
                <MapPinIcon className="h-5 w-5 text-neutral-700 stroke-[2.25]" />
                <span className="text-sm font-bold text-neutral-905">Saved Addresses</span>
              </div>
              <ChevronRightIcon className="h-4 w-4 text-neutral-500 stroke-[2.5]" />
            </div>

            {/* Payment Methods */}
            <div 
              onClick={hapticTap}
              className="border border-neutral-200 rounded-2xl bg-white p-4 shadow-sm flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-50 active:scale-[0.99] transition-all duration-105"
            >
              <div className="flex items-center gap-3">
                <CreditCardIcon className="h-5 w-5 text-neutral-700 stroke-[2.25]" />
                <span className="text-sm font-bold text-neutral-905">Payment Methods</span>
              </div>
              <ChevronRightIcon className="h-4 w-4 text-neutral-500 stroke-[2.5]" />
            </div>

            {/* Push Notifications */}
            <div 
              className="border border-neutral-200 rounded-2xl bg-white p-4 shadow-sm flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <BellIcon className="h-5 w-5 text-neutral-700 stroke-[2.25]" />
                <span className="text-sm font-bold text-neutral-905">Push Notifications</span>
              </div>
              {/* Custom Switch Toggle */}
              <div 
                onClick={() => { hapticTap(); setPushEnabled(prev => !prev); }}
                className={cn(
                  "w-12 h-6.5 rounded-full relative cursor-pointer border border-neutral-350 shadow-sm transition-colors duration-150",
                  pushEnabled ? "bg-[#46c300] border-neutral-850" : "bg-neutral-200"
                )}
              >
                <div 
                  className={cn(
                    "h-5 w-5 rounded-full bg-white transition-all duration-150 absolute top-[2px] shadow border border-neutral-350", 
                    pushEnabled ? "left-[23px]" : "left-[3px]"
                  )}
                />
              </div>
            </div>

            {/* Language */}
            <div 
              onClick={hapticTap}
              className="border border-neutral-200 rounded-2xl bg-white p-4 shadow-sm flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-50 active:scale-[0.99] transition-all duration-105"
            >
              <div className="flex items-center gap-3">
                <LanguageIcon className="h-5 w-5 text-neutral-700 stroke-[2.25]" />
                <span className="text-sm font-bold text-neutral-905">Language</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-neutral-500">English</span>
                <ChevronRightIcon className="h-4 w-4 text-neutral-500 stroke-[2.5]" />
              </div>
            </div>
          </div>

          {/* Log Out CTA */}
          <div className="pt-2">
            <button 
              onClick={handleLogout}
              className="w-full bg-[#b91c1c] text-white hover:bg-red-800 active:scale-[0.98] transition-all duration-100 border border-neutral-200 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2.5 cursor-pointer shadow-sm"
            >
              <svg className="h-5 w-5 text-white stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              LOG OUT
            </button>
          </div>

          {/* App Version Info */}
          <div className="text-center pt-2">
            <p className="text-[10px] font-semibold text-neutral-400">
              App Version 2.4.0 (Industrial Build)
            </p>
          </div>
        </motion.div>
      </AppShell>

      {/* Bottom Nav */}
      <BottomNav items={CLIENT_NAV} />
    </>
  )
}

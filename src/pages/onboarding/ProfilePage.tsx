import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UserIcon, EnvelopeIcon, PhoneIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { AppShell } from '@/components/layout/AppShell'
import { hapticTap, cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export default function ProfilePage() {
  const navigate = useNavigate()
  
  // Read from Google OAuth / Mock Google session
  const mockName = localStorage.getItem('google_mock_name') ?? 'Kofi Mensah'
  const mockEmail = localStorage.getItem('google_mock_email') ?? 'kofi.mensah@gmail.com'

  const [fullName] = useState(mockName)
  const [email] = useState(mockEmail)
  const [phone, setPhone] = useState('+233')
  const [phoneFocused, setPhoneFocused] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Sync to local storage on load
  useEffect(() => {
    localStorage.setItem('borlaboard_profile_name', fullName)
    localStorage.setItem('borlaboard_profile_email', email)
  }, [fullName, email])

  function handleContinue() {
    // Basic Ghana phone validation: +233 followed by 9 digits
    const phoneDigits = phone.replace(/\D/g, '')
    if (phoneDigits.length < 12) {
      setError('Please enter a valid phone number (e.g., +233 24 123 4567)')
      return
    }
    hapticTap()
    localStorage.setItem('borlaboard_profile_phone', phone.trim())
    navigate('/onboarding/residential')
  }

  return (
    <AppShell>
      {/* Brand Header Logo */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-30 -mx-4 -mt-4 mb-6 flex items-center justify-center border-b border-neutral-200 bg-white py-4 shadow-sm"
      >
        <span className="text-xl font-black uppercase tracking-[0.15em] text-neutral-900 select-none">
          CITYBINS
        </span>
      </motion.header>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-neutral-400">
          Step 1 of 2
        </p>
        <h1 className="mt-1 text-3xl font-black text-neutral-900">Complete Your Profile</h1>
        <p className="mt-2 text-sm font-semibold text-neutral-500">
          Verify your personal details and add your phone number so collectors can reach you.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="space-y-6"
      >
        {/* Read Only Name */}
        <div className="w-full space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-500">
            Full Name (From Google)
          </label>
          <div className="relative flex items-center rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-neutral-600 shadow-sm">
            <UserIcon className="h-5 w-5 mr-3 shrink-0 text-neutral-450" />
            <span className="text-[15px] font-bold">{fullName}</span>
            <span className="absolute right-4 text-[9px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-md border border-neutral-200">
              Locked
            </span>
          </div>
        </div>

        {/* Read Only Email */}
        <div className="w-full space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-500">
            Email Address (From Google)
          </label>
          <div className="relative flex items-center rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-neutral-600 shadow-sm">
            <EnvelopeIcon className="h-5 w-5 mr-3 shrink-0 text-neutral-450" />
            <span className="text-[15px] font-bold">{email}</span>
            <span className="absolute right-4 text-[9px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-md border border-neutral-200">
              Locked
            </span>
          </div>
        </div>

        {/* Chunky Phone input */}
        <div className="w-full space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-500">
            Phone Number
          </label>
          <div
            className={cn(
              "relative flex items-center rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all duration-100",
              phoneFocused && "border-neutral-400",
              error && "border-red-500"
            )}
          >
            <div className="pl-4 shrink-0">
              <PhoneIcon className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type="tel"
              placeholder="+233 XX XXX XXXX"
              value={phone}
              className="flex-1 bg-transparent py-4 px-3 text-[17px] font-semibold text-neutral-900 placeholder:text-neutral-400 outline-none tracking-wide"
              onFocus={() => setPhoneFocused(true)}
              onBlur={() => setPhoneFocused(false)}
              onChange={(e) => {
                let val = e.target.value
                // Lock the +233 prefix
                if (!val.startsWith('+233')) {
                  val = '+233' + val.replace(/^\+?233?/, '')
                }
                setPhone(val)
                setError(null)
              }}
            />
          </div>
          {error && <p className="text-[12px] font-bold text-red-500 mt-1">{error}</p>}
          <p className="text-[10px] text-neutral-400 font-semibold mt-1">
            Required for pickup coordination and mobile money billing.
          </p>
        </div>

        {/* Continue Button */}
        <div className="pt-2">
          <button
            onClick={handleContinue}
            className="w-full bg-[#005c4b] hover:bg-[#004a3c] transition-colors text-white text-sm font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            CONTINUE TO LOCATION
          </button>
        </div>

        {/* Sign up as a Driver Link Section */}
        <div className="mt-8 text-center bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
          <p className="text-xs font-bold text-neutral-800">
            Want to collect waste and earn money instead?
          </p>
          <Link
            to="/auth/phone"
            onClick={hapticTap}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-neutral-900 hover:underline transition-colors"
          >
            Sign up as a Driver
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </AppShell>
  )
}

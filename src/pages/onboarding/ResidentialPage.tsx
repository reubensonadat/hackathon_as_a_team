import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPinIcon, HomeIcon, BuildingOfficeIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline'
import { AppShell } from '@/components/layout/AppShell'
import { MapPlaceholder } from '@/components/layout/MapPlaceholder'
import { hapticTap, cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export default function ResidentialPage() {
  const navigate = useNavigate()
  const [address, setAddress] = useState('')
  const [houseNumber, setHouseNumber] = useState('')
  const [area, setArea] = useState('Amamoma')
  const [propertyType, setPropertyType] = useState('Hostel')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [streetFocused, setStreetFocused] = useState(false)
  const [houseFocused, setHouseFocused] = useState(false)

  const propertyTypes = [
    { id: 'Hostel', name: 'Hostel', icon: BuildingOffice2Icon },
    { id: 'Apartment', name: 'Apartment', icon: BuildingOfficeIcon },
    { id: 'House', name: 'House', icon: HomeIcon },
  ]

  async function handleFinish() {
    if (!address.trim()) {
      setError('Street name is required')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const fullAddress = `${houseNumber ? 'House ' + houseNumber + ', ' : ''}${address.trim()}`
      localStorage.setItem('borlaboard_residential_address', fullAddress)
      localStorage.setItem('borlaboard_residential_area', area)
      localStorage.setItem('borlaboard_property_type', propertyType)
      localStorage.setItem('borlaboard_onboarding_complete', 'true')
      hapticTap()
      navigate('/client/home', { replace: true })
    } catch {
      setError('Could not save address. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppShell className="pb-36">
      {/* Brand Header Logo */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center mb-6"
      >
        <span className="text-xl font-black uppercase tracking-[0.15em] text-[#46c300]">
          CITYBINS
        </span>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-neutral-500">
          Step 2 of 2
        </p>
        <h1 className="mt-1 text-3xl font-black text-neutral-900">Set Up Location</h1>
        <p className="mt-2 text-sm font-semibold text-neutral-500">
          Tell us where you live so we can schedule your pickups correctly.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="space-y-6"
      >
        {/* Property Type Selector */}
        <div className="space-y-2">
          <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-800">
            PROPERTY TYPE
          </label>
          <div className="grid grid-cols-3 gap-3">
            {propertyTypes.map((type) => {
              const Icon = type.icon
              const isSelected = propertyType === type.id
              return (
                <button
                  key={type.id}
                  onClick={() => {
                    hapticTap()
                    setPropertyType(type.id)
                  }}
                  className={`flex flex-col items-center justify-center py-5 rounded-xl border-2 border-neutral-950 transition-all duration-100 cursor-pointer text-center ${
                    isSelected
                      ? 'bg-emerald-50 text-[var(--color-primary)] shadow-[4px_4px_0px_0px_#171717] translate-y-0 translate-x-0'
                      : 'bg-white text-neutral-500 hover:bg-neutral-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]'
                  }`}
                >
                  <Icon className={`h-7 w-7 mb-2 stroke-[2.25] ${isSelected ? 'text-[var(--color-primary)]' : 'text-neutral-400'}`} />
                  <span className="text-xs font-black tracking-tight uppercase">{type.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Select Area Dropdown */}
        <div className="space-y-2">
          <label htmlFor="area" className="block text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-800">
            SELECT AREA
          </label>
          <div className="relative flex items-center rounded-xl border-2 border-neutral-950 bg-white shadow-[4px_4px_0px_0px_#171717]">
            <select
              id="area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full rounded-xl bg-transparent py-4 px-4 text-[15px] font-bold text-neutral-900 outline-none appearance-none cursor-pointer"
            >
              <option value="" disabled>Choose your area...</option>
              <option value="Amamoma">Amamoma</option>
              <option value="Cape Coast">Cape Coast</option>
              <option value="Kwaprow">Kwaprow</option>
            </select>
            <div className="pointer-events-none absolute right-4 flex items-center">
              <svg className="h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Street Name input */}
        <div className="space-y-2">
          <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-800">
            STREET NAME
          </label>
          <div
            className={cn(
              "relative flex items-center rounded-xl border-2 border-neutral-950 bg-white shadow-[4px_4px_0px_0px_#171717] transition-all duration-100",
              streetFocused && "translate-y-[1px] translate-x-[1px] shadow-[2px_2px_0px_0px_#171717]",
              error && "border-red-500 shadow-[4px_4px_0px_0px_#ef4444]"
            )}
          >
            <input
              type="text"
              placeholder="e.g. Valco Trust Road"
              value={address}
              className="flex-1 bg-transparent py-4 px-4 text-[15px] font-bold text-neutral-900 placeholder:text-neutral-400 outline-none"
              onFocus={() => setStreetFocused(true)}
              onBlur={() => setStreetFocused(false)}
              onChange={(e) => {
                setAddress(e.target.value)
                setError(null)
              }}
            />
          </div>
          {error && <p className="text-[12px] font-bold text-red-500 mt-1">{error}</p>}
        </div>

        {/* House Number input */}
        <div className="space-y-2">
          <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-800">
            HOUSE NUMBER (OPTIONAL)
          </label>
          <div
            className={cn(
              "relative flex items-center rounded-xl border-2 border-neutral-950 bg-white shadow-[4px_4px_0px_0px_#171717] transition-all duration-100",
              houseFocused && "translate-y-[1px] translate-x-[1px] shadow-[2px_2px_0px_0px_#171717]"
            )}
          >
            <input
              type="text"
              placeholder="e.g. BLK 4A"
              value={houseNumber}
              className="flex-1 bg-transparent py-4 px-4 text-[15px] font-bold text-neutral-900 placeholder:text-neutral-400 outline-none"
              onFocus={() => setHouseFocused(true)}
              onBlur={() => setHouseFocused(false)}
              onChange={(e) => setHouseNumber(e.target.value)}
            />
          </div>
        </div>

        {/* Map Preview Card */}
        <div className="relative h-44 w-full overflow-hidden rounded-xl border-2 border-neutral-950 shadow-[4px_4px_0px_0px_#171717] bg-white">
          <MapPlaceholder 
            label="Location coordinates verified on map" 
            icon={MapPinIcon}
          />
          {/* Overlay to show geocoded status */}
          <div className="absolute top-3 right-3 bg-neutral-900/90 border border-neutral-750 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#46c300] animate-pulse" />
            <span className="text-[9px] font-bold text-white uppercase tracking-wider">GPS Active</span>
          </div>
        </div>
      </motion.div>

      {/* Sticky Fixed Bottom Bar for SAVE PROFILE button */}
      <div className="fixed bottom-0 inset-x-0 bg-white/80 backdrop-blur-lg border-t border-neutral-250 p-4 z-40">
        <div className="mx-auto max-w-lg">
          <button 
            disabled={loading}
            onClick={handleFinish}
            className="w-full shadow-[4px_4px_0px_0px_#171717] bg-[#46c300] hover:bg-[#3ea900] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[2px_2px_0px_0px_#171717] transition-all duration-100 border-2 border-neutral-950 font-black py-4 rounded-xl text-neutral-950 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-950 border-t-transparent" />
            ) : (
              <>
                <svg className="h-5 w-5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V8l-4-4H8z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 20v-8H8v8M16 4v5H8V4" />
                </svg>
                SAVE PROFILE
              </>
            )}
          </button>
        </div>
      </div>
    </AppShell>
  )
}

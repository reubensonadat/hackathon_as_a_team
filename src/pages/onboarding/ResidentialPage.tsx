import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPinIcon, HomeIcon, BuildingOfficeIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { MapPlaceholder } from '@/components/layout/MapPlaceholder'
import { hapticTap } from '@/lib/utils'
import { motion } from 'framer-motion'

export default function ResidentialPage() {
  const navigate = useNavigate()
  const [address, setAddress] = useState('')
  const [houseNumber, setHouseNumber] = useState('')
  const [area, setArea] = useState('Amamoma')
  const [propertyType, setPropertyType] = useState('Hostel')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const propertyTypes = [
    { id: 'Hostel', name: 'Hostel', icon: BuildingOffice2Icon },
    { id: 'Apartment', name: 'Apartment', icon: BuildingOfficeIcon },
    { id: 'House', name: 'House', icon: HomeIcon },
  ]

  async function handleFinish() {
    if (!address.trim()) {
      setError('Street / landmark is required')
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
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-foreground-muted)]">
          Step 2 of 2
        </p>
        <h1 className="mt-1 text-3xl font-black text-emerald-950">Set Up Location</h1>
        <p className="mt-2 text-sm font-medium text-[var(--color-foreground-muted)]">
          Specify your residence type and location for exact waste collection.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="space-y-6"
      >
        {/* Property Type Grid */}
        <div>
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-foreground-muted)]">
            Property Type
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
                  className={`flex flex-col items-center justify-center p-4 rounded-[20px] border transition-all duration-200 cursor-pointer text-center ${
                    isSelected
                      ? 'border-[var(--color-primary)] bg-emerald-50 text-[var(--color-primary)] shadow-sm'
                      : 'border-[var(--color-border)] bg-white text-[var(--color-foreground-muted)] hover:bg-neutral-50'
                  }`}
                >
                  <Icon className={`h-6 w-6 mb-2 ${isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-foreground-muted)]'}`} />
                  <span className="text-xs font-bold">{type.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Inputs */}
        <Card className="space-y-4">
          <div>
            <label
              htmlFor="area"
              className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-foreground-muted)]"
            >
              Area / Neighborhood
            </label>
            <select
              id="area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full rounded-[14px] border border-[var(--color-border)] bg-white px-4 py-3.5 text-[16px] font-semibold text-[var(--color-foreground)] outline-none focus:border-[var(--color-primary)] transition-colors"
            >
              <option value="Amamoma">Amamoma</option>
              <option value="Cape Coast">Cape Coast</option>
              <option value="Kwaprow">Kwaprow</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <Input
                label="Street Name / Landmark"
                placeholder="e.g. Near UCC gate"
                value={address}
                leftIcon={MapPinIcon}
                error={error ?? undefined}
                onChange={(e) => {
                  setAddress(e.target.value)
                  setError(null)
                }}
              />
            </div>
            <div>
              <Input
                label="House No."
                placeholder="e.g. A34"
                value={houseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Map Preview Card */}
        <div className="relative h-44 w-full overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-[var(--shadow-soft)]">
          <MapPlaceholder 
            label="Location coordinates verified on map" 
            icon={MapPinIcon}
          />
          {/* Overlay to show geocoded status */}
          <div className="absolute top-3 right-3 bg-emerald-950/80 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">GPS Active</span>
          </div>
        </div>
      </motion.div>

      {/* Sticky Fixed Bottom Bar for SAVE PROFILE button */}
      <div className="fixed bottom-0 inset-x-0 bg-white/80 backdrop-blur-lg border-t border-[var(--color-border)] p-4 z-40">
        <div className="mx-auto max-w-lg">
          <Button 
            fullWidth 
            loading={loading} 
            onClick={handleFinish}
            className="shadow-md bg-[var(--color-primary)] hover:bg-emerald-800 active:scale-[0.99] transition-transform duration-100"
          >
            SAVE PROFILE
          </Button>
        </div>
      </div>
    </AppShell>
  )
}

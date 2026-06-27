import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Bars3Icon, UserIcon, TrashIcon, CameraIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { AppShell } from '@/components/layout/AppShell'
import { hapticTap, cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { getOrCreateDeviceId } from '@/lib/deviceId'

interface BinCategory {
  id: string
  name: string
  sub: string
  price: number
  icon: (props: any) => JSX.Element
}

export default function PickupDetailsPage() {
  const navigate = useNavigate()
  const [bins, setBins] = useState<{ [key: string]: number }>({
    res_small: 0,
    res_large: 0,
    comm_small: 0,
    comm_large: 0,
  })
  const [spillages, setSpillages] = useState(false)
  const [photo, setPhoto] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const area = localStorage.getItem('borlaboard_residential_area') ?? 'East Legon, Sector 4'
  const address = localStorage.getItem('borlaboard_residential_address') ?? 'Not set'

  const categories: BinCategory[] = [
    {
      id: 'res_small',
      name: 'Residential',
      sub: '(Small)',
      price: 15,
      icon: (props) => (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
    },
    {
      id: 'res_large',
      name: 'Residential',
      sub: '(Large)',
      price: 25,
      icon: (props) => (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7M5 7h14m-9-3h4a1 1 0 011 1v2H9V4a1 1 0 011-1zm-2 9h6m-6 3h4" />
        </svg>
      ),
    },
    {
      id: 'comm_small',
      name: 'Commercial',
      sub: '(Small)',
      price: 50,
      icon: (props) => (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25} {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.129-1.125v-3.02M14.25 5.25v13.5m-3-13.5h3.75a1.125 1.125 0 0 1 1.125 1.125v2.25M15 8.25h3.75a1.125 1.125 0 0 1 1.125 1.125v2.25" />
        </svg>
      ),
    },
    {
      id: 'comm_large',
      name: 'Commercial',
      sub: '(Large)',
      price: 100,
      icon: (props) => (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
  ]

  const handleIncrement = (id: string) => {
    hapticTap()
    setBins((prev) => ({ ...prev, [id]: prev[id] + 1 }))
  }

  const handleDecrement = (id: string) => {
    hapticTap()
    setBins((prev) => ({ ...prev, [id]: Math.max(0, prev[id] - 1) }))
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    hapticTap()
    setUploading(true)
    
    try {
      if (!supabase) throw new Error('Supabase not connected')

      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('pickups')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('pickups').getPublicUrl(fileName)
      setPhoto(data.publicUrl)
    } catch (error) {
      console.error('Error uploading photo:', error)
      alert('Could not upload photo. Have you created the "pickups" public bucket in Supabase?')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleRemovePhoto = (e: React.MouseEvent) => {
    e.stopPropagation()
    hapticTap()
    setPhoto(null)
  }

  const calculateTotal = () => {
    let total = 0
    categories.forEach((cat) => {
      total += bins[cat.id] * cat.price
    })
    if (spillages) {
      total += 10
    }
    return total
  }

  const handleContinueRequest = async () => {
    hapticTap()
    const activeBins = categories
      .filter((cat) => bins[cat.id] > 0)
      .map((cat) => ({ type: `${cat.name} ${cat.sub}`, count: bins[cat.id], price: cat.price }))

    if (activeBins.length === 0) {
      alert('Please select at least one bin.')
      return
    }

    setSubmitting(true)

    try {
      if (!supabase) throw new Error('Supabase not connected')
      
      const price = calculateTotal()
      const deviceId = getOrCreateDeviceId()
      
      const { error } = await supabase.from('pickup_requests').insert({
        resident_device_id: deviceId,
        proposed_price: price,
        address_text: address,
        photo_url: photo,
        location_lat: 5.1053, // Mocked lat/lng for hackathon
        location_lng: -1.2466,
      })

      if (error) throw error

      navigate('/client/track')
    } catch (error) {
      console.error('Error creating request:', error)
      alert('Failed to create pickup request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
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
          
          <Link to="/client/account" className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-neutral-300 text-neutral-500 hover:border-neutral-500 transition-colors">
            <UserIcon className="h-5 w-5" />
          </Link>
        </motion.header>

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-neutral-900 leading-tight">Pickup Details</h1>
          <p className="mt-1 text-sm font-semibold text-neutral-500">
            Specify the bins for collection.
          </p>
        </div>

        {/* Form Fields */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="space-y-6"
        >
          {/* Bin Types & Quantities */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-500">
              Bin Types & Quantities
            </label>
            <div className="grid grid-cols-2 gap-4">
              {categories.map((cat) => {
                const count = bins[cat.id]
                const isSelected = count > 0
                const Icon = cat.icon
                return (
                  <div
                    key={cat.id}
                    className={cn(
                      "relative border bg-white p-4 rounded-[28px] shadow-sm flex flex-col justify-between transition-all duration-100 min-h-[140px]",
                      isSelected ? "bg-[#46c300] border-neutral-900" : "border-neutral-200"
                    )}
                  >
                    {/* Top Row: Icon & Checkbox */}
                    <div className="flex items-center justify-between">
                      <Icon className={cn("h-7 w-7", isSelected ? "text-white" : "text-[#46c300]")} />
                      <div 
                        className={cn(
                          "h-5 w-5 rounded border flex items-center justify-center transition-colors cursor-pointer",
                          isSelected 
                            ? "border-neutral-950 bg-neutral-950 text-[#46c300]" 
                            : "border-neutral-350 bg-white"
                        )}
                        onClick={() => {
                          if (isSelected) {
                            setBins(prev => ({ ...prev, [cat.id]: 0 }))
                          } else {
                            setBins(prev => ({ ...prev, [cat.id]: 1 }))
                          }
                          hapticTap()
                        }}
                      >
                        {isSelected && (
                          <svg className="h-3 w-3 text-[#46c300] stroke-[3.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Middle: Labels */}
                    <div className="mt-4 mb-3">
                      <p className={cn("text-xs font-black leading-tight", isSelected ? "text-white" : "text-neutral-900")}>
                        {cat.name}
                      </p>
                      <p className={cn("text-xs font-black leading-tight mt-0.5", isSelected ? "text-white" : "text-neutral-900")}>
                        {cat.sub}
                      </p>
                    </div>

                    <hr className="border-t border-dashed border-neutral-300 mb-3" />

                    {/* Bottom: Stepper */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleDecrement(cat.id)}
                        disabled={count === 0}
                        className={cn(
                          "h-8 w-8 rounded border bg-white hover:bg-neutral-50 active:scale-95 transition-transform flex items-center justify-center font-bold text-neutral-950 disabled:opacity-30 disabled:cursor-not-allowed",
                          isSelected ? "border-neutral-900 bg-neutral-950/5 hover:bg-neutral-950/15" : "border-neutral-300"
                        )}
                      >
                        -
                      </button>
                      <span className={cn("text-sm font-black", isSelected ? "text-white" : "text-neutral-900")}>{count}</span>
                      <button
                        onClick={() => handleIncrement(cat.id)}
                        className={cn(
                          "h-8 w-8 rounded border bg-white hover:bg-neutral-50 active:scale-95 transition-transform flex items-center justify-center font-bold text-neutral-950",
                          isSelected ? "border-neutral-900 bg-neutral-950/5 hover:bg-neutral-950/15" : "border-neutral-300"
                        )}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Spillages Toggle */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-500">
              Are there spillages?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { hapticTap(); setSpillages(true); }}
                className={cn(
                  "py-3.5 rounded-2xl border font-bold text-sm transition-all duration-100 cursor-pointer text-center",
                  spillages 
                    ? "bg-[#46c300] text-white border-neutral-900 shadow-sm" 
                    : "bg-white text-neutral-600 border-neutral-200 shadow-sm hover:bg-neutral-50"
                )}
              >
                YES
              </button>
              <button
                onClick={() => { hapticTap(); setSpillages(false); }}
                className={cn(
                  "py-3.5 rounded-2xl border font-bold text-sm transition-all duration-100 cursor-pointer text-center",
                  !spillages 
                    ? "bg-[#46c300] text-white border-neutral-900 shadow-sm" 
                    : "bg-white text-neutral-600 border-neutral-200 shadow-sm hover:bg-neutral-50"
                )}
              >
                NO
              </button>
            </div>
          </div>

          {/* Visual Context upload area */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-500">
              Visual Context (Optional)
            </label>
            
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handlePhotoUpload} 
              className="hidden" 
            />

            <div 
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "relative flex flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-[#46c300] bg-emerald-50/10 p-6 text-center cursor-pointer transition-all duration-100 shadow-sm",
                photo && "border-solid bg-white border-neutral-200"
              )}
            >
              {uploading ? (
                <div className="flex flex-col items-center py-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-3 border-black border-t-transparent mb-2" />
                  <span className="text-xs font-bold text-neutral-800">Uploading photo...</span>
                </div>
              ) : photo ? (
                <div className="relative w-full">
                  <img 
                    src={photo} 
                    alt="Waste Context" 
                    className="mx-auto h-32 w-full object-cover rounded-xl border border-neutral-200"
                  />
                  <button
                    onClick={handleRemovePhoto}
                    className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow-md active:scale-90 hover:bg-red-700 transition-colors border border-neutral-200"
                  >
                    <TrashIcon className="h-4.5 w-4.5" />
                  </button>
                </div>
              ) : (
                <div className="py-2 flex flex-col items-center justify-center text-center">
                  <div className="h-12 w-12 rounded-full bg-[#46c300] border border-neutral-200 flex items-center justify-center mb-2 shadow-sm">
                    <CameraIcon className="h-6 w-6 text-white stroke-[2.5]" />
                  </div>
                  <span className="block text-xs font-black text-neutral-900 mt-1">Take a Photo of the Bins</span>
                </div>
              )}
            </div>
          </div>
      </motion.div>

      {/* Sticky Fixed Bottom Bar for CONTINUE TO REQUEST button */}
      <div className="fixed bottom-0 inset-x-0 bg-white/80 backdrop-blur-lg border-t border-neutral-200 p-4 z-40">
        <div className="mx-auto max-w-lg">
          <button 
            disabled={submitting || uploading}
            onClick={handleContinueRequest}
            className="w-full bg-[#46c300] hover:bg-[#3ea900] transition-colors text-white text-sm font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
          >
            {submitting ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                CONTINUE TO REQUEST
                <ArrowRightIcon className="h-4 w-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>
      </div>
    </AppShell>
  )
}

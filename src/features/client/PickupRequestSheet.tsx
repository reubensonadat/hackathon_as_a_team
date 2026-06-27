import { useState, useRef } from 'react'
import { PlusIcon, MinusIcon, CameraIcon, TrashIcon } from '@heroicons/react/24/outline'
import { BottomSheet } from '@/components/layout/BottomSheet'
import { Button } from '@/components/ui/Button'
import { hapticTap } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

interface PickupRequestSheetProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: {
    bins: { type: string; count: number }[]
    spillages: boolean
    photo: string | null
  }) => void
}

export function PickupRequestSheet({ open, onClose, onSubmit }: PickupRequestSheetProps) {
  const [bins, setBins] = useState([
    { type: 'Standard Bin', count: 1, desc: '80L Standard household bin', price: 15 },
    { type: 'Large Bin', count: 0, desc: '120L Medium waste bin', price: 25 },
    { type: 'Commercial Bin', count: 0, desc: '240L Heavy-duty waste bin', price: 50 },
  ])
  
  const [spillages, setSpillages] = useState(false)
  const [photo, setPhoto] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleIncrement = (index: number) => {
    hapticTap()
    setBins(prev => prev.map((b, i) => i === index ? { ...b, count: b.count + 1 } : b))
  }

  const handleDecrement = (index: number) => {
    hapticTap()
    setBins(prev => prev.map((b, i) => i === index && b.count > 0 ? { ...b, count: b.count - 1 } : b))
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

  const totalCost = bins.reduce((sum, b) => sum + (b.count * b.price), 0) + (spillages ? 10 : 0)

  const handleSubmit = () => {
    hapticTap()
    onSubmit({
      bins: bins.filter(b => b.count > 0).map(b => ({ type: b.type, count: b.count })),
      spillages,
      photo
    })
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Pickup Details">
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pb-4 scrollbar-none pr-1">
        {/* Bin Selectors */}
        <div>
          <label className="mb-3 block text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-foreground-muted)]">
            Select Bin Sizes & Quantity
          </label>
          <div className="space-y-3">
            {bins.map((bin, index) => (
              <div 
                key={bin.type}
                className="flex items-center justify-between p-4 rounded-2xl border border-[var(--color-border)] bg-white hover:border-emerald-500/30 transition-colors"
              >
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">{bin.type}</h4>
                  <p className="text-[11px] font-medium text-[var(--color-foreground-muted)] mt-0.5">{bin.desc}</p>
                  <p className="text-xs font-extrabold text-[var(--color-primary)] mt-1.5">GHS {bin.price}.00 each</p>
                </div>
                
                {/* Stepper */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDecrement(index)}
                    disabled={bin.count === 0}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-foreground)] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-50 transition-transform duration-100"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <span className="w-6 text-center text-sm font-black text-emerald-950">{bin.count}</span>
                  <button
                    onClick={() => handleIncrement(index)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-foreground)] active:scale-95 hover:bg-neutral-50 transition-transform duration-100"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spillages Toggle */}
        <div className="flex items-center justify-between p-4 rounded-2xl border border-[var(--color-border)] bg-white">
          <div>
            <h4 className="text-sm font-bold text-emerald-950">Are there spillages?</h4>
            <p className="text-[11px] font-medium text-[var(--color-foreground-muted)] mt-0.5">
              Spilled waste around the bin adds GHS 10.00
            </p>
          </div>
          <div className="flex rounded-xl bg-neutral-100 p-1">
            <button
              onClick={() => { hapticTap(); setSpillages(true); }}
              className={`rounded-lg px-4 py-1.5 text-xs font-black transition-all cursor-pointer ${
                spillages 
                  ? 'bg-[var(--color-primary)] text-white shadow-sm' 
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              YES
            </button>
            <button
              onClick={() => { hapticTap(); setSpillages(false); }}
              className={`rounded-lg px-4 py-1.5 text-xs font-black transition-all cursor-pointer ${
                !spillages 
                  ? 'bg-neutral-200 text-neutral-800 shadow-sm' 
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              NO
            </button>
          </div>
        </div>

        {/* Visual Context upload area */}
        <div>
          <label className="mb-2.5 block text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-foreground-muted)]">
            Visual Context
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
            className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200 ${
              photo 
                ? 'border-emerald-500 bg-emerald-50/20' 
                : 'border-[var(--color-border)] bg-neutral-50 hover:bg-neutral-100/70 hover:border-emerald-500/50'
            }`}
          >
            {uploading ? (
              <div className="flex flex-col items-center py-4">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-[var(--color-primary)] border-t-transparent mb-2" />
                <span className="text-xs font-bold text-emerald-800">Uploading photo...</span>
              </div>
            ) : photo ? (
              <div className="relative w-full">
                <img 
                  src={photo} 
                  alt="Waste Context" 
                  className="mx-auto h-32 w-full object-cover rounded-xl shadow-sm border border-emerald-100"
                />
                <button
                  onClick={handleRemovePhoto}
                  className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow-md active:scale-90 hover:bg-red-700 transition-colors"
                >
                  <TrashIcon className="h-4.5 w-4.5" />
                </button>
              </div>
            ) : (
              <div className="py-2">
                <CameraIcon className="mx-auto h-8 w-8 text-neutral-400 mb-2" />
                <span className="block text-xs font-black text-emerald-950">ADD PHOTO ATTACHMENT</span>
                <span className="block text-[10px] text-[var(--color-foreground-muted)] font-medium mt-1">
                  Helps collectors prepare necessary tools
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Price & Continue */}
        <div className="pt-2 border-t border-[var(--color-border)] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-emerald-950">Estimated Fee</span>
            <span className="text-xl font-black text-emerald-950">GHS {totalCost.toFixed(2)}</span>
          </div>

          <Button
            fullWidth
            onClick={handleSubmit}
            disabled={totalCost === 0 || uploading}
            className="bg-[var(--color-primary)] hover:bg-emerald-800 shadow-md font-bold text-[15px] py-4 rounded-xl"
          >
            CONTINUE TO REQUEST
          </Button>
        </div>
      </div>
    </BottomSheet>
  )
}

import type { ReactNode } from 'react'
import { MapIcon } from '@heroicons/react/24/outline'

interface MapPlaceholderProps {
  label?: string
  overlay?: ReactNode
  icon?: React.ComponentType<{ className?: string }>
}

export function MapPlaceholder({
  label = 'Map layer (Mapbox heatmap / Google routing)',
  overlay,
  icon: CustomIcon,
}: MapPlaceholderProps) {
  const Icon = CustomIcon ?? MapIcon

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-200 via-emerald-100 to-orange-100">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute left-[20%] top-[30%] h-24 w-24 rounded-full bg-orange-400 blur-3xl" />
          <div className="absolute right-[15%] top-[45%] h-32 w-32 rounded-full bg-red-400 blur-3xl" />
          <div className="absolute bottom-[25%] left-[40%] h-20 w-20 rounded-full bg-yellow-400 blur-2xl" />
        </div>
        <Icon className="relative z-10 mb-3 h-10 w-10 text-[var(--color-foreground-muted)]" />
        <p className="relative z-10 px-6 text-center text-xs font-medium text-[var(--color-foreground-muted)]">
          {label}
        </p>
      </div>
      {overlay && (
        <div className="absolute inset-x-0 bottom-0 z-10 p-4">{overlay}</div>
      )}
    </div>
  )
}

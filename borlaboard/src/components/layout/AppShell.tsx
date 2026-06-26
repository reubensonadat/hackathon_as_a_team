import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface AppShellProps {
  children: ReactNode
  mapBackground?: boolean
  className?: string
}

export function AppShell({ children, mapBackground = false, className }: AppShellProps) {
  return (
    <div className={cn('relative min-h-full', className)}>
      {mapBackground && (
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-emerald-100/60 via-[var(--color-background)] to-orange-50/80" />
      )}
      <div className="relative z-10 mx-auto flex min-h-full max-w-lg flex-col px-4 pb-28 pt-6">
        {children}
      </div>
    </div>
  )
}

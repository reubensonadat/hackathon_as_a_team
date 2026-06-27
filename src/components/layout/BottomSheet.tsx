import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          <motion.button
            type="button"
            aria-label="Close sheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            className="relative z-[70] w-full max-w-lg rounded-t-[var(--radius-sheet)] border-t border-[var(--color-border)] bg-[var(--color-surface)] px-6 pb-8 pt-4 shadow-[var(--shadow-strong)]"
          >
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-[var(--color-border)]" />
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-black text-[var(--color-foreground)]">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-[8px] text-[var(--color-foreground-muted)] hover:bg-[var(--color-surface-muted)]"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

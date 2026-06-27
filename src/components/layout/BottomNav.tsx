import { useLocation, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { NavItem } from '@/types'
import { cn } from '@/lib/utils'
import { hapticTap } from '@/lib/utils'

interface BottomNavProps {
  items: NavItem[]
}

export function BottomNav({ items }: BottomNavProps) {
  const location = useLocation()
  const activeIndex = items.findIndex(
    (item) =>
      location.pathname === item.path || location.pathname.startsWith(`${item.path}/`),
  )

  return (
    <motion.nav
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-4 left-1/2 z-50 w-[min(100%-2rem,28rem)] -translate-x-1/2 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="relative rounded-full bg-neutral-900 p-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.25)]">
        {activeIndex >= 0 && (
          <motion.div
            layoutId="nav-pill"
            className="absolute inset-y-1.5 rounded-full bg-[var(--color-primary)]"
            style={{
              width: `calc((100% - 12px) / ${items.length})`,
              left: `calc(6px + ${activeIndex} * ((100% - 12px) / ${items.length}))`,
            }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          />
        )}

        <ul className="relative flex">
          {items.map((item) => {
            const isActive =
              location.pathname === item.path ||
              location.pathname.startsWith(`${item.path}/`)
            const Icon = isActive ? item.iconSolid : item.icon

            return (
              <li key={item.path} className="flex-1">
                <NavLink
                  to={item.path}
                  onClick={() => hapticTap()}
                  className={cn(
                    'relative z-10 flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-full px-2 py-2 text-[10px] font-semibold transition-colors',
                    isActive ? 'text-white' : 'text-neutral-400',
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>
    </motion.nav>
  )
}

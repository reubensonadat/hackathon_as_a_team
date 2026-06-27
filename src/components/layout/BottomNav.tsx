import { useRef, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { NavItem } from '@/types'
import { cn, hapticTap } from '@/lib/utils'

interface BottomNavProps {
  items: NavItem[]
}

export function BottomNav({ items }: BottomNavProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 })
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([])
  const isDark = location.pathname.startsWith('/collector')

  useEffect(() => {
    // Small timeout to ensure DOM layout is complete before measuring
    const timeoutId = setTimeout(() => {
      const activeIndex = items.findIndex(
        (item) =>
          location.pathname === item.path ||
          location.pathname.startsWith(`${item.path}/`),
      )
      if (activeIndex !== -1 && tabsRef.current[activeIndex]) {
        const el = tabsRef.current[activeIndex]
        if (el) {
          setPillStyle({
            left: el.offsetLeft,
            width: el.offsetWidth,
            opacity: 1,
          })
        }
      } else {
        setPillStyle((prev) => ({ ...prev, opacity: 0 }))
      }
    }, 50)
    return () => clearTimeout(timeoutId)
  }, [location.pathname, items])

  const handleTabClick = (path: string) => {
    hapticTap()
    navigate(path)
  }

  return (
    <div className="fixed bottom-0 left-0 w-full px-4 pb-[calc(1rem_+_env(safe-area-inset-bottom,0px))] z-50 flex justify-center">
      <div className={cn(
        "rounded-[20px] relative flex items-center justify-between px-3 h-[64px] w-full max-w-lg overflow-hidden",
        isDark 
          ? "bg-[#1C1C1E] border-none" 
          : "bg-white shadow-[var(--shadow-medium)] border border-[var(--color-border)]"
      )}>
        {/* Sliding Pill */}
        <div
          className={cn(
            "absolute h-11 rounded-xl",
            isDark ? "bg-[#005c4b]" : "bg-[var(--color-primary)]"
          )}
          style={{
            left: `${pillStyle.left}px`,
            width: `${pillStyle.width}px`,
            opacity: pillStyle.opacity,
            transition: 'left 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease-in'
          }}
        />

        {items.map((tab, index) => {
          const isActive =
            location.pathname === tab.path ||
            location.pathname.startsWith(`${tab.path}/`)
          const Icon = isActive ? tab.iconSolid : tab.icon

          return (
            <button
              key={tab.path}
              ref={(el) => { tabsRef.current[index] = el }}
              onClick={() => handleTabClick(tab.path)}
              className={cn(
                "relative z-10 flex flex-row items-center justify-center px-4 py-2.5 h-11 rounded-xl focus:outline-none transition-colors duration-200 select-none cursor-pointer",
                isActive 
                  ? (isDark ? "text-black" : "text-white") 
                  : (isDark ? "text-neutral-500 hover:text-white" : "text-neutral-400 hover:text-neutral-600")
              )}
              aria-label={tab.label}
            >
              <Icon className={cn(
                "h-5 w-5", 
                isActive 
                  ? (isDark ? "text-black" : "text-white") 
                  : (isDark ? "text-neutral-500" : "text-neutral-400")
              )} />
              {isActive && (
                <span className={cn(
                  "text-[11px] font-black ml-2 whitespace-nowrap tracking-wide uppercase",
                  isDark ? "text-black" : "text-white"
                )}>
                  {tab.label}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

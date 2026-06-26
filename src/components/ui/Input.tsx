import { forwardRef, useState } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ComponentType<{ className?: string }>
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon: LeftIcon, className, id, ...props }, ref) => {
    const [focused, setFocused] = useState(false)
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--color-foreground-muted)]"
          >
            {label}
          </label>
        )}
        <div
          className={cn(
            'relative flex items-center rounded-[14px] border bg-[var(--color-surface-muted)] transition-all duration-200',
            focused
              ? 'border-[var(--color-accent)] shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-accent)_15%,transparent)]'
              : error
                ? 'border-red-400'
                : 'border-[var(--color-border)] hover:border-[var(--color-foreground-muted)]',
          )}
        >
          {LeftIcon && (
            <div className="pl-3 shrink-0">
              <LeftIcon
                className={cn(
                  'h-5 w-5 transition-colors',
                  focused ? 'text-[var(--color-accent)]' : 'text-[var(--color-foreground-muted)]',
                )}
              />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'flex-1 bg-transparent py-3.5 px-4 text-[16px] font-semibold text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-muted)] outline-none',
              LeftIcon && 'pl-2',
              className,
            )}
            onFocus={(e) => {
              setFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setFocused(false)
              props.onBlur?.(e)
            }}
            {...props}
          />
        </div>
        {error && <p className="text-[12px] font-medium text-red-500">{error}</p>}
        {hint && !error && (
          <p className="text-[12px] text-[var(--color-foreground-muted)]">{hint}</p>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'

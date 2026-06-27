import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  `inline-flex items-center justify-center gap-2 font-semibold
   transition-all duration-150 select-none cursor-pointer
   focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]
   disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
   active:scale-[0.97]`,
  {
    variants: {
      variant: {
        primary: 'bg-[var(--color-accent)] text-white shadow-[0_8px_30px_rgb(249,115,22,0.35)] hover:opacity-90',
        secondary: 'bg-[var(--color-primary)] text-white hover:opacity-90',
        outline: 'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground)] hover:bg-[var(--color-surface-muted)]',
        ghost: 'bg-[var(--color-surface)] text-[var(--color-foreground)] shadow-[var(--shadow-soft)] hover:bg-[var(--color-surface-muted)]',
        danger: 'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        sm: 'h-9 px-3 text-[13px] rounded-[10px]',
        md: 'h-11 px-4 text-[14px] rounded-[10px]',
        lg: 'h-12 px-6 text-[15px] rounded-[12px]',
        xl: 'h-14 px-8 text-[16px] rounded-[12px]',
        icon: 'h-10 w-10 rounded-[10px]',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'lg',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  leftIcon?: React.ComponentType<{ className?: string }>
  rightIcon?: React.ComponentType<{ className?: string }>
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <>
            {LeftIcon && <LeftIcon className="h-4 w-4 shrink-0" />}
            {children}
            {RightIcon && <RightIcon className="h-4 w-4 shrink-0" />}
          </>
        )}
      </button>
    )
  },
)
Button.displayName = 'Button'

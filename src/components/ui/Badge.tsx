import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 font-black uppercase tracking-[0.12em] border',
  {
    variants: {
      variant: {
        default: 'bg-[var(--color-surface-muted)] text-[var(--color-foreground-muted)] border-[var(--color-border)]',
        open: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        claimed: 'bg-orange-50 text-orange-600 border-orange-200',
        completed: 'bg-neutral-100 text-neutral-700 border-neutral-200',
        cancelled: 'bg-red-50 text-red-600 border-red-200',
        accent: 'bg-[var(--color-accent-muted)] text-[var(--color-accent)] border-orange-200',
      },
      size: {
        sm: 'text-[10px] px-2 py-0.5 rounded-[6px]',
        md: 'text-[11px] px-2.5 py-1 rounded-[6px]',
      },
    },
    defaultVariants: { variant: 'default', size: 'sm' },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {children}
    </span>
  )
}

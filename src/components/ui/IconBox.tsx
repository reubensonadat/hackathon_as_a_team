import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const iconBoxVariants = cva('flex shrink-0 items-center justify-center', {
  variants: {
    variant: {
      default: 'bg-[var(--color-surface-muted)] text-[var(--color-foreground-muted)]',
      primary: 'bg-neutral-900 text-white',
      accent: 'bg-[var(--color-accent-muted)] text-[var(--color-accent)]',
      success: 'bg-emerald-50 text-emerald-600',
    },
    size: {
      sm: 'h-8 w-8 rounded-[8px]',
      md: 'h-10 w-10 rounded-[10px]',
      lg: 'h-12 w-12 rounded-[12px]',
      xl: 'h-16 w-16 rounded-[16px]',
    },
  },
  defaultVariants: { variant: 'default', size: 'md' },
})

export interface IconBoxProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof iconBoxVariants> {
  icon: React.ComponentType<{ className?: string }>
}

export function IconBox({ icon: Icon, variant, size, className, ...props }: IconBoxProps) {
  return (
    <div className={cn(iconBoxVariants({ variant, size }), className)} {...props}>
      <Icon className="h-5 w-5" />
    </div>
  )
}

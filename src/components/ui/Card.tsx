import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const cardVariants = cva('bg-[var(--color-surface)] border border-[var(--color-border)]', {
  variants: {
    variant: {
      default: 'shadow-[var(--shadow-soft)]',
      elevated: 'shadow-[var(--shadow-medium)]',
      interactive:
        'shadow-[var(--shadow-soft)] cursor-pointer hover:shadow-[var(--shadow-medium)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200',
      flat: 'shadow-none',
    },
    padding: {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-5',
    },
    radius: {
      md: 'rounded-[18px]',
      lg: 'rounded-[22px]',
      xl: 'rounded-[32px]',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'lg',
    radius: 'lg',
  },
})

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export function Card({ className, variant, padding, radius, ...props }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant, padding, radius }), className)} {...props} />
  )
}

function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-4 flex items-center justify-between', className)} {...props} />
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-[16px] font-black tracking-tight text-[var(--color-foreground)]', className)}
      {...props}
    />
  )
}

function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('', className)} {...props} />
}

Card.Header = CardHeader
Card.Title = CardTitle
Card.Body = CardBody

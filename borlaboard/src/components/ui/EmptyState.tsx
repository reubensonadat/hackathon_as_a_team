import { Button } from '@/components/ui/Button'

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      {Icon && (
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-[16px] bg-[var(--color-surface-muted)]">
          <Icon className="h-8 w-8 text-[var(--color-foreground-muted)]" />
        </div>
      )}
      <h3 className="mb-2 text-[17px] font-black text-[var(--color-foreground)]">{title}</h3>
      {description && (
        <p className="max-w-[260px] text-[14px] leading-relaxed text-[var(--color-foreground-muted)]">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-6 w-full max-w-xs">
          <Button onClick={action.onClick}>{action.label}</Button>
        </div>
      )}
    </div>
  )
}

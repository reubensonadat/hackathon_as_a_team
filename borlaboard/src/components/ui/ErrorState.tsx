interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-[22px] border border-red-200 bg-red-50 p-5">
      <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-red-400">
        Something went wrong
      </p>
      <p className="mt-1 text-sm font-black text-red-700">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 text-xs font-black text-[var(--color-accent)]"
        >
          Try again
        </button>
      )}
    </div>
  )
}

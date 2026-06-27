export interface CustomIconProps {
  className?: string
  size?: number
  strokeWidth?: number
}

export function BorlaBoardMarkIcon({
  className,
  size = 24,
  strokeWidth = 1.5,
}: CustomIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 18h16" />
      <path d="M8 18V8l4-3 4 3v10" />
      <path d="M12 5v3" />
      <circle cx="17" cy="7" r="2" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function WasteBinIcon({ className, size = 24, strokeWidth = 1.5 }: CustomIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9 6V4h6v2" />
      <path d="M5 6h14l-1 14H6L5 6z" />
      <path d="M10 10v6M14 10v6" />
    </svg>
  )
}

export function PickupTruckIcon({ className, size = 24, strokeWidth = 1.5 }: CustomIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 12h11v5H3z" />
      <path d="M14 12h3l3 3v2h-6" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  )
}

export function HeatmapPulseIcon({ className, size = 24, strokeWidth = 1.5 }: CustomIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="7" opacity="0.45" />
      <circle cx="12" cy="12" r="10" opacity="0.2" />
    </svg>
  )
}

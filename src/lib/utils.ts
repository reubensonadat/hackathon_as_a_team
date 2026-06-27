import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatGhs(amount: number): string {
  return `GH₵${amount.toFixed(2)}`
}

export function hapticTap() {
  navigator.vibrate?.(10)
}

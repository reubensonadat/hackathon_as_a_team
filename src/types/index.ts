export type UserRole = 'resident' | 'driver'

export type JobStatus = 'open' | 'claimed' | 'completed' | 'cancelled'

export type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string; data?: T }

export interface NavItem {
  label: string
  path: string
  icon: React.ComponentType<{ className?: string }>
  iconSolid: React.ComponentType<{ className?: string }>
}

export interface ResidentProfile {
  deviceId: string
  fullName?: string
  phone?: string
  addressLine?: string
  area?: string
  city?: string
  locationLat?: number
  locationLng?: number
  onboardingComplete: boolean
}

export interface PickupRequest {
  id: string
  residentDeviceId: string
  driverId?: string
  photoUrl: string
  proposedPrice: number
  locationLat: number
  locationLng: number
  addressText?: string
  status: JobStatus
  claimedAt?: string
  completedAt?: string
  createdAt: string
}

export interface DriverProfile {
  id: string
  phone: string
  fullName?: string
  vehicleType?: string
  walletBalance: number
}

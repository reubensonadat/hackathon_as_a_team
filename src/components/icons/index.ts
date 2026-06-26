import {
  HomeIcon,
  MapPinIcon,
  UserCircleIcon,
  MapIcon,
  ClipboardDocumentListIcon,
  PhoneIcon,
  KeyIcon,
} from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeSolidIcon,
  MapPinIcon as MapPinSolidIcon,
  UserCircleIcon as UserCircleSolidIcon,
  MapIcon as MapSolidIcon,
  ClipboardDocumentListIcon as ClipboardSolidIcon,
} from '@heroicons/react/24/solid'

export const NavIcons = {
  outline: {
    home: HomeIcon,
    track: MapPinIcon,
    account: UserCircleIcon,
    jobs: MapIcon,
    history: ClipboardDocumentListIcon,
    phone: PhoneIcon,
    otp: KeyIcon,
  },
  solid: {
    home: HomeSolidIcon,
    track: MapPinSolidIcon,
    account: UserCircleSolidIcon,
    jobs: MapSolidIcon,
    history: ClipboardSolidIcon,
  },
} as const

export * from './custom'

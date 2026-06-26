import type { ComponentType } from 'react'
import type { NavItem } from '@/types'
import { NavIcons } from '@/components/icons'

export const CLIENT_NAV: NavItem[] = [
  {
    label: 'Home',
    path: '/client/home',
    icon: NavIcons.outline.home,
    iconSolid: NavIcons.solid.home,
  },
  {
    label: 'Track',
    path: '/client/track',
    icon: NavIcons.outline.track,
    iconSolid: NavIcons.solid.track,
  },
  {
    label: 'Account',
    path: '/client/account',
    icon: NavIcons.outline.account,
    iconSolid: NavIcons.solid.account,
  },
]

export const COLLECTOR_NAV: NavItem[] = [
  {
    label: 'Jobs',
    path: '/collector/dashboard',
    icon: NavIcons.outline.jobs,
    iconSolid: NavIcons.solid.jobs,
  },
  {
    label: 'History',
    path: '/collector/history',
    icon: NavIcons.outline.history,
    iconSolid: NavIcons.solid.history,
  },
  {
    label: 'Account',
    path: '/collector/account',
    icon: NavIcons.outline.account,
    iconSolid: NavIcons.solid.account,
  },
]

export const PLATFORM_CLAIM_FEE = 0.5

export type IconComponent = ComponentType<{ className?: string }>

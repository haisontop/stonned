import { RiTwitterLine, RiInstagramLine } from 'react-icons/ri'
import { FaDiscord } from 'react-icons/fa'
import { MeIcon } from '../Icons'
import { NavItem } from './types'

export const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Stoned Apes',
    href: '/',
  },
  {
    label: 'Nuked Apes',
    href: '/nukedapes',
  },
  {
    label: 'Gallery',
    href: '/gallery',
  },
  {
    label: 'Holder Area',
    subMenu: true,
    items: [
      {
        label: 'Staking',
        href: '/staking',
      },
      {
        label: 'Evolution',
        href: '/evolution',
      },
      {
        label: 'Rescue NAC',
        href: '/rescue',
      },
      {
        label: 'Awakening',
        href: '/awakening',
      },
      {
        label: 'Stats',
        href: '/analytics',
      },
    ],
  },
  {
    label: 'Lucky Dip',
    href: '/lucky-dip',
  },
  {
    label: 'Shop',
    href: '/store',
  },
  {
    label: 'Events',
    subMenu: true,
    items: [
      {
        label: 'Los Angeles 22',
        href: '/events/la',
      },
      {
        label: 'Amsterdam 22',
        href: '/events/amsterdam',
      },
    ],
  },
  {
    label: '$PUFF',
    href: '/puff',
  },
  {
    label: 'Careers',
    href: '/careers',
  },
  {
    label: 'ALL Blue',
    href: 'https://allblue.dev/',
    isExternal: true,
  },
]

export const NAV_ICONS = [
  {
    label: 'Twitter',
    href: 'https://twitter.com/stonedapecrew',
    icon: <RiTwitterLine size='24px' />,
  },
  {
    label: 'Discord',
    href: 'https://discord.gg/stonedapecrew',
    icon: <FaDiscord size='24px' />,
  },
  {
    label: 'Magic Eden',
    href: 'https://magiceden.io/marketplace/nuked_apes',
    icon: <MeIcon width={'24px'} height='24px' />,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/stonedapesofficial/',
    icon: <RiInstagramLine size='24px' />,
  },
]

export interface NavItem {
  label: string
  items?: Array<NavItem>
  href?: string
  color?: string
  subMenu?: boolean
  isExternal?: boolean
}

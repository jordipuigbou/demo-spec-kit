export interface NavItem {
  id: string
  label: string
  href: string
  icon?: string
}

export interface TopBarProps {
  onToggleSidebar?: () => void
  sidebarExpanded?: boolean
}

export interface SidebarProps {
  items: NavItem[]
  expanded: boolean
  onToggle: () => void
}

export interface AppShellProps {
  children: React.ReactNode
}

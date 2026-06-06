/**
 * Component prop interfaces for the layout shell feature.
 * These define the public API surface of each new/modified component.
 *
 * Reference: specs/002-layout-sidebar-topbar/data-model.md
 */

// ─── NavItem ─────────────────────────────────────────────────────────────────

export interface NavItem {
  /** Unique identifier used as React key */
  id: string
  /** Human-readable label shown in expanded sidebar state */
  label: string
  /** Navigation target — Next.js Link href */
  href: string
  /** Optional icon identifier shown in collapsed state */
  icon?: string
}

// ─── TopBar ──────────────────────────────────────────────────────────────────

export interface TopBarProps {
  /** Callback fired when the sidebar toggle button is clicked */
  onToggleSidebar?: () => void
  /** Whether the sidebar is currently expanded (used for toggle aria-label) */
  sidebarExpanded?: boolean
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

export interface SidebarProps {
  /** Navigation items to render */
  items: NavItem[]
  /** Whether the sidebar is in expanded state (shows labels) */
  expanded: boolean
  /** Callback fired when the user clicks the collapse/expand toggle */
  onToggle: () => void
}

// ─── AppShell ────────────────────────────────────────────────────────────────

export interface AppShellProps {
  /** Page content rendered in the main content area */
  children: React.ReactNode
}

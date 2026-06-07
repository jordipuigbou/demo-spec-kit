'use client'

import { useEffect, useState } from 'react'
import { TopBar } from '../TopBar/TopBar'
import { Sidebar } from '../Sidebar/Sidebar'
import type { AppShellProps, NavItem } from '@/types/sidebar'

const NAV_ITEMS: NavItem[] = [
  { id: 'conferences', label: 'Conferencias', href: '/', icon: 'conference' },
  { id: 'training', label: 'Formación', href: '#', icon: 'training' },
  { id: 'resources', label: 'Recursos de Testing', href: '#', icon: 'resources' },
  { id: 'jobs', label: 'Empleo', href: '#', icon: 'jobs' },
  { id: 'community', label: 'Comunidad', href: '#', icon: 'community' },
  { id: 'tools', label: 'Herramientas', href: '#', icon: 'tools' },
]

const STORAGE_KEY = 'sidebarExpanded'

export function AppShell({ children }: AppShellProps) {
  const [expanded, setExpanded] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) setExpanded(stored === 'true')
  }, [])

  function toggle() {
    const next = !expanded
    setExpanded(next)
    localStorage.setItem(STORAGE_KEY, String(next))
  }

  return (
    <div
      data-testid="app-shell"
      className={[
        'grid min-h-screen',
        expanded ? 'sidebar-expanded' : 'sidebar-collapsed',
      ].join(' ')}
      style={{
        gridTemplateRows: 'var(--topbar-h) 1fr',
        gridTemplateColumns: expanded ? 'var(--sidebar-w) 1fr' : 'var(--sidebar-w-collapsed) 1fr',
        gridTemplateAreas: '"topbar topbar" "sidebar main"',
      }}
    >
      <div style={{ gridArea: 'topbar' }}>
        <TopBar onToggleSidebar={toggle} sidebarExpanded={expanded} />
      </div>
      <div style={{ gridArea: 'sidebar' }}>
        <Sidebar items={NAV_ITEMS} expanded={expanded} onToggle={toggle} />
      </div>
      <main
        role="main"
        className="p-6 overflow-auto"
        style={{ gridArea: 'main' }}
      >
        {children}
      </main>
    </div>
  )
}

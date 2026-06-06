'use client'

import Link from 'next/link'
import type { TopBarProps } from '@/types/sidebar'

function LogoMark() {
  return (
    <Link href="/" className="flex items-center font-bold text-lg font-[family-name:var(--font-ui)]" aria-label="QA">
      <span data-testid="logo-mark">QA</span>
    </Link>
  )
}

export function TopBar({ onToggleSidebar, sidebarExpanded = true }: TopBarProps) {
  return (
    <header
      role="banner"
      className="w-full flex items-center justify-between px-4 bg-white border-b border-gray-200 font-[family-name:var(--font-ui)]"
      style={{ height: 'var(--topbar-h)' }}
    >
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            aria-label={sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            className="p-1.5 rounded hover:bg-gray-100 transition-colors font-[family-name:var(--font-ui)]"
          >
            {sidebarExpanded ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <rect x="3" y="5" width="14" height="2" rx="1" fill="currentColor" />
                <rect x="3" y="9" width="10" height="2" rx="1" fill="currentColor" />
                <rect x="3" y="13" width="14" height="2" rx="1" fill="currentColor" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <rect x="3" y="5" width="14" height="2" rx="1" fill="currentColor" />
                <rect x="3" y="9" width="14" height="2" rx="1" fill="currentColor" />
                <rect x="3" y="13" width="14" height="2" rx="1" fill="currentColor" />
              </svg>
            )}
          </button>
        )}
        <LogoMark />
      </div>
    </header>
  )
}

import { NavItem } from './NavItem'
import type { SidebarProps } from '@/types/sidebar'

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M10 12 L6 8 L10 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 4 L10 8 L6 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function Sidebar({ items, expanded, onToggle }: SidebarProps) {
  return (
    <nav
      role="navigation"
      className={[
        'sticky flex flex-col bg-white border-r border-gray-100 transition-all duration-300 ease-in-out overflow-hidden',
        expanded ? 'expanded w-64' : 'collapsed w-16',
      ].join(' ')}
      style={{
        top: 'var(--topbar-h)',
        height: 'calc(100vh - var(--topbar-h))',
      }}
    >
      <div className="flex-1 px-3 py-5 flex flex-col gap-3">
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-1.5">
          <ul className="flex flex-col gap-0.5">
            {items.map((item) => (
              <NavItem key={item.id} item={item} expanded={expanded} />
            ))}
          </ul>
        </div>
      </div>
      <div className="p-2 border-t border-gray-100">
        <button
          onClick={onToggle}
          aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
          className="w-full flex items-center justify-center p-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
        >
          {expanded ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>
    </nav>
  )
}

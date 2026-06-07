import Link from 'next/link'
import type { NavItem as NavItemType } from '@/types/sidebar'

const ICONS: Record<string, React.ReactNode> = {
  conference: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M2 6.5h3.5l5.5-4v13L5.5 11.5H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1Z"
        fill="currentColor"
      />
      <path d="M13 6a4 4 0 0 1 0 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M14.5 4a7 7 0 0 1 0 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.4" />
    </svg>
  ),
  training: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="1" y="3" width="16" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M6 14.5v1.5h6v-1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9 7l1.5 1L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M11.5 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  resources: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M3 2h8l4 4v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M11 2v4h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 9h8M5 12h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  jobs: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="1" y="6" width="16" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M6 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M1 10h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.4" />
    </svg>
  ),
  community: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 15c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="3.5" cy="7" r="1.8" stroke="currentColor" strokeWidth="1.3" opacity="0.5" />
      <path d="M1 14c0-2 1.2-3.2 2.5-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.5" />
    </svg>
  ),
  tools: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M13.5 2a3 3 0 0 0-2.9 3.7L3.3 13a1.5 1.5 0 1 0 2.1 2.1l7.3-7.3A3 3 0 1 0 13.5 2Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
}

interface NavItemProps {
  item: NavItemType
  expanded: boolean
}

export function NavItem({ item, expanded }: NavItemProps) {
  const icon = item.icon ? ICONS[item.icon] : null
  return (
    <li>
      <Link
        href={item.href}
        className={`flex items-center py-3 rounded-xl text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors ${expanded ? 'gap-3 px-3' : 'justify-center px-0'}`}
        aria-label={item.label}
      >
        {icon && (
          <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
            {icon}
          </span>
        )}
        {expanded && (
          <span className="font-[family-name:var(--font-ui)] text-lg font-medium truncate">
            {item.label}
          </span>
        )}
      </Link>
    </li>
  )
}

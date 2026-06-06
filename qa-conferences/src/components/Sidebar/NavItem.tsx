import Link from 'next/link'
import type { NavItem as NavItemType } from '@/types/sidebar'

const ICONS: Record<string, React.ReactNode> = {
  conference: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M2 6.5h3.5l5.5-4v13L5.5 11.5H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1Z"
        fill="currentColor"
      />
      <path
        d="M13 6a4 4 0 0 1 0 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M14.5 4a7 7 0 0 1 0 10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />
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
          <span className="font-[family-name:var(--font-ui)] text-sm font-medium truncate">
            {item.label}
          </span>
        )}
      </Link>
    </li>
  )
}

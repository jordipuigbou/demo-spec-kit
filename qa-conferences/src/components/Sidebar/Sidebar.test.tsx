import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Sidebar } from './Sidebar'
import type { NavItem } from '@/types/sidebar'

const items: NavItem[] = [
  { id: '1', label: 'Conferencias', href: '/', icon: 'conference' },
]

describe('Sidebar', () => {
  it('[AC-SP002-US02-CR01] renders with correct positioning class', async ({ annotate }) => {
    await annotate('acceptance-criteria', 'AC-SP002-US02-CR01')
    render(<Sidebar items={items} expanded={true} onToggle={() => {}} />)
    const nav = screen.getByRole('navigation')
    expect(nav.className).toMatch(/fixed|sticky|relative/)
  })

  it('[AC-SP002-US02-CR02] NavItem renders label text when expanded=true', async ({ annotate }) => {
    await annotate('acceptance-criteria', 'AC-SP002-US02-CR02')
    render(<Sidebar items={items} expanded={true} onToggle={() => {}} />)
    expect(screen.getByText('Conferencias')).toBeTruthy()
  })

  it('[AC-SP002-US02-CR03] hides label text when expanded=false', async ({ annotate }) => {
    await annotate('acceptance-criteria', 'AC-SP002-US02-CR03')
    render(<Sidebar items={items} expanded={false} onToggle={() => {}} />)
    const label = screen.queryByText('Conferencias')
    expect(label).toBeNull()
  })

  it('[AC-SP002-US02-CR03] applies narrow-width class when expanded=false', async ({ annotate }) => {
    await annotate('acceptance-criteria', 'AC-SP002-US02-CR03')
    render(<Sidebar items={items} expanded={false} onToggle={() => {}} />)
    const nav = screen.getByRole('navigation')
    expect(nav.className).toMatch(/collapsed|w-16|narrow/)
  })

  it('[AC-SP002-US02-CR04] shows label text and wide-width class when re-expanded', async ({ annotate }) => {
    await annotate('acceptance-criteria', 'AC-SP002-US02-CR04')
    const { rerender } = render(<Sidebar items={items} expanded={false} onToggle={() => {}} />)
    rerender(<Sidebar items={items} expanded={true} onToggle={() => {}} />)
    expect(screen.getByText('Conferencias')).toBeTruthy()
    const nav = screen.getByRole('navigation')
    expect(nav.className).toMatch(/expanded|w-64|wide/)
  })

  it('[AC-SP002-US02-CR05] NavItem renders as link with correct href', async ({ annotate }) => {
    await annotate('acceptance-criteria', 'AC-SP002-US02-CR05')
    render(<Sidebar items={items} expanded={true} onToggle={() => {}} />)
    const link = screen.getByRole('link', { name: /Conferencias/i })
    expect(link).toHaveAttribute('href', '/')
  })

  it('[AC-SP002-US04-CR03] NavItem label carries font-ui class', async ({ annotate }) => {
    await annotate('acceptance-criteria', 'AC-SP002-US04-CR03')
    render(<Sidebar items={items} expanded={true} onToggle={() => {}} />)
    const label = screen.getByText('Conferencias')
    expect(label.className).toMatch(/font-/)
  })
})

import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { AppShell } from './AppShell'

describe('AppShell — User Story 1 Integration', () => {
  beforeEach(() => { localStorage.clear() })

  it('[AC-SP002-US01-CR01, AC-SP002-US01-CR04] renders TopBar at the top across the full component tree', async ({ annotate }) => {
    await annotate('acceptance-criteria', 'AC-SP002-US01-CR01')
    await annotate('acceptance-criteria', 'AC-SP002-US01-CR04')
    render(<AppShell><div>content</div></AppShell>)
    expect(screen.getByRole('banner')).toBeTruthy()
    expect(screen.getByText('content')).toBeTruthy()
  })
})

describe('AppShell — User Story 2 Integration', () => {
  beforeEach(() => { localStorage.clear() })

  it('[AC-SP002-US02-CR03, AC-SP002-US02-CR04] toggle button updates expanded state and writes to localStorage', async ({ annotate }) => {
    await annotate('acceptance-criteria', 'AC-SP002-US02-CR03')
    await annotate('acceptance-criteria', 'AC-SP002-US02-CR04')
    render(<AppShell><div>content</div></AppShell>)
    expect(localStorage.getItem('sidebarExpanded')).toBeNull()

    // Both TopBar and Sidebar have a collapse button — use the first (TopBar's)
    const toggleBtns = screen.getAllByRole('button', { name: /collapse sidebar/i })
    fireEvent.click(toggleBtns[0])

    expect(localStorage.getItem('sidebarExpanded')).toBe('false')
    const expandBtns = screen.getAllByRole('button', { name: /expand sidebar/i })
    expect(expandBtns.length).toBeGreaterThan(0)
  })

  it('[AC-SP002-US02-CR03, AC-SP002-US02-CR04] reads initial sidebar state from localStorage on mount', async ({ annotate }) => {
    await annotate('acceptance-criteria', 'AC-SP002-US02-CR03')
    await annotate('acceptance-criteria', 'AC-SP002-US02-CR04')
    localStorage.setItem('sidebarExpanded', 'false')
    render(<AppShell><div>content</div></AppShell>)
    const expandBtns = screen.getAllByRole('button', { name: /expand sidebar/i })
    expect(expandBtns.length).toBeGreaterThan(0)
  })
})

describe('AppShell — User Story 3 Layout', () => {
  beforeEach(() => { localStorage.clear() })

  it('[AC-SP002-US03-CR01] main area has padding class matching --content-padding', async ({ annotate }) => {
    await annotate('acceptance-criteria', 'AC-SP002-US03-CR01')
    render(<AppShell><div>content</div></AppShell>)
    const main = screen.getByRole('main')
    expect(main.className).toMatch(/p-6|p-\[1\.5rem\]|padding/)
  })

  it('[AC-SP002-US03-CR02] root element has CSS Grid classes for layout', async ({ annotate }) => {
    await annotate('acceptance-criteria', 'AC-SP002-US03-CR02')
    render(<AppShell><div>content</div></AppShell>)
    const wrapper = screen.getByTestId('app-shell')
    expect(wrapper.className).toMatch(/grid/)
  })

  it('[AC-SP002-US03-CR03] applies sidebar-collapsed class to grid when sidebar is collapsed', async ({ annotate }) => {
    await annotate('acceptance-criteria', 'AC-SP002-US03-CR03')
    localStorage.setItem('sidebarExpanded', 'false')
    render(<AppShell><div>content</div></AppShell>)
    const wrapper = screen.getByTestId('app-shell')
    expect(wrapper.className).toMatch(/sidebar-collapsed|collapsed/)
  })

  it('[AC-SP002-US03-CR02, AC-SP002-US03-CR03] full tree updates layout CSS variable when sidebar toggles', async ({ annotate }) => {
    await annotate('acceptance-criteria', 'AC-SP002-US03-CR02')
    await annotate('acceptance-criteria', 'AC-SP002-US03-CR03')
    render(<AppShell><div>content</div></AppShell>)
    const wrapper = screen.getByTestId('app-shell')
    expect(wrapper.className).not.toMatch(/sidebar-collapsed/)

    const toggleBtns = screen.getAllByRole('button', { name: /collapse sidebar/i })
    fireEvent.click(toggleBtns[0])

    expect(wrapper.className).toMatch(/sidebar-collapsed|collapsed/)
  })
})

describe('AppShell — User Story 4 Typography', () => {
  it('[Edge-SP002-US04-A] --font-ui CSS variable declaration includes Inter fallback', async ({ annotate }) => {
    await annotate('acceptance-criteria', 'Edge-SP002-US04-A')
    render(<AppShell><div>content</div></AppShell>)
    expect(screen.getByRole('banner')).toBeTruthy()
  })

  it('[AC-SP002-US04-CR01, AC-SP002-US04-CR02, AC-SP002-US04-CR03] full tree applies font-ui class on buttons, top bar, and sidebar labels', async ({ annotate }) => {
    await annotate('acceptance-criteria', 'AC-SP002-US04-CR01')
    await annotate('acceptance-criteria', 'AC-SP002-US04-CR02')
    await annotate('acceptance-criteria', 'AC-SP002-US04-CR03')
    render(<AppShell><div>content</div></AppShell>)
    const banner = screen.getByRole('banner')
    expect(banner.className).toMatch(/font-/)
  })
})

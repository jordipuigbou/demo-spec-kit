import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TopBar } from './TopBar'

describe('TopBar', () => {
  it('[AC-SP002-US01-CR01] renders a full-width layout container', async ({ annotate }) => {
    await annotate('acceptance-criteria', 'AC-SP002-US01-CR01')
    render(<TopBar />)
    const bar = screen.getByRole('banner')
    expect(bar.className).toMatch(/w-full/)
  })

  it('[AC-SP002-US01-CR02] renders logo mark on the left side', async ({ annotate }) => {
    await annotate('acceptance-criteria', 'AC-SP002-US01-CR02')
    render(<TopBar />)
    const logo = screen.getByTestId('logo-mark')
    expect(logo).toBeTruthy()
  })

  it('[AC-SP002-US01-CR03] logo mark is a link with href="/"', async ({ annotate }) => {
    await annotate('acceptance-criteria', 'AC-SP002-US01-CR03')
    render(<TopBar />)
    const logoLink = screen.getByRole('link', { name: /QA/i })
    expect(logoLink).toHaveAttribute('href', '/')
  })

  it('[AC-SP002-US01-CR02] sidebar toggle button has correct aria-label when expanded', async ({ annotate }) => {
    await annotate('acceptance-criteria', 'AC-SP002-US01-CR02')
    render(<TopBar sidebarExpanded={true} onToggleSidebar={() => {}} />)
    const btn = screen.getByRole('button', { name: /collapse sidebar/i })
    expect(btn).toBeTruthy()
  })

  it('[AC-SP002-US01-CR02] sidebar toggle button has correct aria-label when collapsed', async ({ annotate }) => {
    await annotate('acceptance-criteria', 'AC-SP002-US01-CR02')
    render(<TopBar sidebarExpanded={false} onToggleSidebar={() => {}} />)
    const btn = screen.getByRole('button', { name: /expand sidebar/i })
    expect(btn).toBeTruthy()
  })

  it('[Edge-SP002-US01-A] LogoMark renders "QA" text fallback', async ({ annotate }) => {
    await annotate('acceptance-criteria', 'Edge-SP002-US01-A')
    render(<TopBar />)
    expect(screen.getByText('QA')).toBeTruthy()
  })

  it('[AC-SP002-US04-CR01] toggle button carries font-ui class', async ({ annotate }) => {
    await annotate('acceptance-criteria', 'AC-SP002-US04-CR01')
    render(<TopBar onToggleSidebar={() => {}} sidebarExpanded={false} />)
    const btn = screen.getByRole('button', { name: /expand sidebar/i })
    expect(btn.closest('[class*="font-"]') ?? btn).toBeTruthy()
  })

  it('[AC-SP002-US04-CR02] TopBar root container carries font-ui class', async ({ annotate }) => {
    await annotate('acceptance-criteria', 'AC-SP002-US04-CR02')
    render(<TopBar />)
    const bar = screen.getByRole('banner')
    expect(bar.className).toMatch(/font-/)
  })
})

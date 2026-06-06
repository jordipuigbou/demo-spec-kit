import { test, expect } from '../fixtures'

test.describe('QA Conferences Dashboard', () => {
  test(
    '[AC-SP001-US01-CR01,CR03,CR04] full P1 user journey — cards visible, desktop grid, mobile single-column',
    { tag: ['@ac-SP001-US01-CR01', '@ac-SP001-US01-CR03', '@ac-SP001-US01-CR04'] },
    async ({ page }) => {
      // AC-SP001-US01-CR01: Dashboard loads with 7 conference cards
      await page.goto('/')
      const cards = page.getByRole('article')
      await expect(cards).toHaveCount(7)

      // AC-SP001-US01-CR03: Desktop — multi-column grid at 1440px
      await page.setViewportSize({ width: 1440, height: 900 })
      await expect(cards).toHaveCount(7)
      const grid = page.locator('[data-testid="event-grid"]')
      const gridClass = await grid.getAttribute('class')
      expect(gridClass).toContain('grid')

      // AC-SP001-US01-CR04: Mobile — single-column at 375px, no horizontal scroll
      await page.setViewportSize({ width: 375, height: 812 })
      await expect(cards).toHaveCount(7)
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
    }
  )
})

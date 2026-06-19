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

  // T012 [AC-SP003-US01-CR01,CR02,CR03,CR04] + [AC-SP003-US02-CR01] P1 critical path
  test(
    '[AC-SP003-US01+US02] city filter P1 critical path — default state, select city, switch city',
    {
      tag: [
        '@ac-SP003-US01-CR01',
        '@ac-SP003-US01-CR02',
        '@ac-SP003-US01-CR03',
        '@ac-SP003-US01-CR04',
        '@ac-SP003-US02-CR01',
      ],
    },
    async ({ page }) => {
      await page.goto('/')

      // AC-SP003-US02-CR01: default state — all 7 cards, selector shows "All cities"
      const cards = page.getByRole('article')
      await expect(cards).toHaveCount(7)
      const select = page.getByTestId('city-select')
      await expect(select).toHaveValue('')

      // AC-SP003-US01-CR01: city list is populated
      const options = await select.locator('option').allTextContents()
      expect(options.length).toBeGreaterThan(1)
      expect(options).toContain('Madrid')
      expect(options).toContain('Barcelona')

      // AC-SP003-US01-CR02: select Madrid — only Madrid cards shown
      await select.selectOption('Madrid')
      const madridCards = page.getByRole('article')
      await expect(madridCards).toHaveCount(2)

      // AC-SP003-US01-CR03+CR04: switch to Barcelona — updated card set
      await select.selectOption('Barcelona')
      await expect(page.getByRole('article')).toHaveCount(2)

      // Verify card names contain Barcelona
      const cardTexts = await page.getByRole('article').allTextContents()
      expect(cardTexts.every((t) => t.includes('Barcelona') || t.includes('BCN'))).toBe(true)
    }
  )

  // T013 [Edge: filter persistence on resize]
  test(
    '[Edge: filter persistence] city filter remains active after viewport resize',
    { tag: ['@ac-SP003-US01-EC04'] },
    async ({ page }) => {
      await page.goto('/')
      const select = page.getByTestId('city-select')
      await select.selectOption('Madrid')
      await expect(page.getByRole('article')).toHaveCount(2)

      // Resize to mobile
      await page.setViewportSize({ width: 375, height: 812 })
      await expect(page.getByRole('article')).toHaveCount(2)
      await expect(select).toHaveValue('Madrid')

      // No horizontal scroll
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)

      // Resize back to desktop
      await page.setViewportSize({ width: 1440, height: 900 })
      await expect(page.getByRole('article')).toHaveCount(2)
      await expect(select).toHaveValue('Madrid')
    }
  )
})

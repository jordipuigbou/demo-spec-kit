import { test, expect } from '@playwright/test'

test.describe('Layout — Top Bar (US1)', () => {
  test(
    'logo click navigates to "/" and top bar persists after navigation',
    { tag: ['@ac-SP002-US01-CR03', '@ac-SP002-US01-CR04'] },
    async ({ page }) => {
      await page.goto('/')
      const topBar = page.getByRole('banner')
      await expect(topBar).toBeVisible()

      const logoLink = page.getByRole('link', { name: /QA/i })
      await logoLink.click()
      await page.waitForURL('/')

      await expect(page.getByRole('banner')).toBeVisible()
    }
  )
})

test.describe('Layout — Sidebar (US2)', () => {
  test(
    'sidebar collapses within 300ms and expanded state persists after page reload',
    { tag: ['@ac-SP002-US02-CR03', '@ac-SP002-US02-CR04'] },
    async ({ page }) => {
      await page.goto('/')

      const nav = page.getByRole('navigation')
      await expect(nav).toBeVisible()

      const topBar = page.getByRole('banner')
      const collapseBtn = topBar.getByRole('button', { name: /collapse sidebar/i })
      const start = Date.now()
      await collapseBtn.click()
      await expect(topBar.getByRole('button', { name: /expand sidebar/i })).toBeVisible()
      expect(Date.now() - start).toBeLessThan(300)

      await page.reload()
      await expect(page.getByRole('banner').getByRole('button', { name: /expand sidebar/i })).toBeVisible()
    }
  )
})

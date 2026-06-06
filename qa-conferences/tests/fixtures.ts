import { test as base, expect } from '@playwright/test'

export const test = base.extend<{ _acAnnotations: void }>({
  _acAnnotations: [
    async ({}, use, testInfo) => {
      for (const tag of testInfo.tags) {
        if (tag.startsWith('@ac-')) {
          testInfo.annotations.push({
            type: 'acceptance-criteria',
            description: tag.replace('@ac-', ''),
          })
        }
      }
      await use()
    },
    { auto: true },
  ],
})

export { expect }

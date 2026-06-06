import { describe, it, expect } from 'vitest'
import { formatDate } from './formatDate'

describe('formatDate', () => {
  it('[AC-SP001-US01-CR05] formats ISO date string to Spanish locale display string', (ctx) => {
    ctx.annotate?.('acceptance-criteria', 'SP001-US01-CR05')
    expect(formatDate('2026-03-12')).toBe('12 de marzo de 2026')
  })

  it('[AC-SP001-US01-CR05] formats another date correctly', (ctx) => {
    ctx.annotate?.('acceptance-criteria', 'SP001-US01-CR05')
    expect(formatDate('2026-11-20')).toBe('20 de noviembre de 2026')
  })

  it('[AC-SP001-US01-CR05] handles January dates', (ctx) => {
    ctx.annotate?.('acceptance-criteria', 'SP001-US01-CR05')
    expect(formatDate('2026-01-01')).toBe('1 de enero de 2026')
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from './page'

describe('Dashboard Page', () => {
  it('[AC-SP001-US01-CR01] renders all 7 conference event cards from CONFERENCES data', async (ctx) => {
    ctx.annotate?.('acceptance-criteria', 'SP001-US01-CR01')
    render(<Page />)
    const cards = await screen.findAllByRole('article')
    expect(cards).toHaveLength(7)
  })
})

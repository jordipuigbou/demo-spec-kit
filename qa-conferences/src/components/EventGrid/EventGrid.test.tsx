import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EventGrid } from './EventGrid'
import type { ConferenceEvent } from '@/types/conference'

const mockEvents: ConferenceEvent[] = [
  { id: '1', name: 'Conf A', date: '2026-03-12', city: 'Madrid', imageUrl: 'https://example.com/a.jpg', imageAlt: 'Conf A image' },
  { id: '2', name: 'Conf B', date: '2026-04-23', city: 'Barcelona', imageUrl: 'https://example.com/b.jpg', imageAlt: 'Conf B image' },
  { id: '3', name: 'Conf C', date: '2026-05-15', city: 'Valencia', imageUrl: 'https://example.com/c.jpg', imageAlt: 'Conf C image' },
]

describe('EventGrid', () => {
  it('[AC-SP001-US01-CR01] renders one card for each event in the events prop', (ctx) => {
    ctx.annotate?.('acceptance-criteria', 'SP001-US01-CR01')
    render(<EventGrid events={mockEvents} />)
    const cards = screen.getAllByRole('article')
    expect(cards).toHaveLength(3)
  })

  it('[Edge: Empty events list] renders friendly empty-state message when events is empty', () => {
    render(<EventGrid events={[]} />)
    const cards = screen.queryAllByRole('article')
    expect(cards).toHaveLength(0)
    expect(screen.getByText(/no hay eventos/i)).toBeInTheDocument()
  })

  it('[AC-SP001-US01-CR03] root element has responsive grid Tailwind CSS classes', (ctx) => {
    ctx.annotate?.('acceptance-criteria', 'SP001-US01-CR03')
    const { container } = render(<EventGrid events={mockEvents} />)
    const grid = container.firstElementChild as HTMLElement
    expect(grid.className).toContain('grid')
    expect(grid.className).toContain('grid-cols-1')
  })
})

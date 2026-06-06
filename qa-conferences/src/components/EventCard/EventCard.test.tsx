import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EventCard } from './EventCard'
import type { ConferenceEvent } from '@/types/conference'

const mockEvent: ConferenceEvent = {
  id: 'test-event-001',
  name: 'TestingConf Madrid 2026',
  date: '2026-03-12',
  city: 'Madrid',
  imageUrl: 'https://example.com/image.jpg',
  imageAlt: 'Conference hall in Madrid',
}

describe('EventCard', () => {
  it('[AC-SP001-US01-CR02] renders event name, formatted date, city, and image', (ctx) => {
    ctx.annotate?.('acceptance-criteria', 'SP001-US01-CR02')
    render(<EventCard event={mockEvent} />)
    expect(screen.getByText('TestingConf Madrid 2026')).toBeInTheDocument()
    expect(screen.getByText('12 de marzo de 2026')).toBeInTheDocument()
    expect(screen.getByText('Madrid')).toBeInTheDocument()
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg')
    expect(img).toHaveAttribute('alt', 'Conference hall in Madrid')
  })

  it('[AC-SP001-US01-CR05] displays date via formatDate in Spanish locale', (ctx) => {
    ctx.annotate?.('acceptance-criteria', 'SP001-US01-CR05')
    render(<EventCard event={mockEvent} />)
    expect(screen.getByText('12 de marzo de 2026')).toBeInTheDocument()
    expect(screen.queryByText('2026-03-12')).not.toBeInTheDocument()
  })

  it('[Edge: Image fallback] shows placeholder when image fails to load', (ctx) => {
    ctx.annotate?.('acceptance-criteria', 'SP001-US01-CR02')
    render(<EventCard event={mockEvent} />)
    const img = screen.getByRole('img')
    fireEvent.error(img)
    expect(img).toHaveAttribute('src', '/images/placeholder.svg')
    expect(screen.getByText('TestingConf Madrid 2026')).toBeInTheDocument()
    expect(screen.getByText('12 de marzo de 2026')).toBeInTheDocument()
    expect(screen.getByText('Madrid')).toBeInTheDocument()
  })

  it('[Edge: Long conference name] applies overflow protection class to name element', () => {
    const longNameEvent = {
      ...mockEvent,
      name: 'A'.repeat(120),
    }
    render(<EventCard event={longNameEvent} />)
    const nameEl = screen.getByText('A'.repeat(120))
    const hasOverflowClass =
      nameEl.className.includes('truncate') ||
      nameEl.className.includes('overflow-hidden') ||
      nameEl.className.includes('line-clamp')
    expect(hasOverflowClass).toBe(true)
  })
})

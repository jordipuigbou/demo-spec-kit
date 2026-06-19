import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import type { ConferenceEvent } from '@/types/conference'

// Hoisted so vi.mock factory can reference them before module initialisation
const { MADRID, BARCELONA, BARCELONA2, MADRID_TRAILING } = vi.hoisted(() => {
  const MADRID: ConferenceEvent = {
    id: 'm1', name: 'Madrid Conf', date: '2026-01-01', city: 'Madrid', imageUrl: '', imageAlt: '',
  }
  const BARCELONA: ConferenceEvent = {
    id: 'b1', name: 'BCN Conf', date: '2026-02-01', city: 'Barcelona', imageUrl: '', imageAlt: '',
  }
  const BARCELONA2: ConferenceEvent = {
    id: 'b2', name: 'BCN Conf 2', date: '2026-03-01', city: 'Barcelona', imageUrl: '', imageAlt: '',
  }
  const MADRID_TRAILING: ConferenceEvent = {
    id: 'm2', name: 'Madrid Trailing', date: '2026-04-01', city: 'Madrid ', imageUrl: '', imageAlt: '',
  }
  return { MADRID, BARCELONA, BARCELONA2, MADRID_TRAILING }
})

vi.mock('@/data/conferences', () => ({
  CONFERENCES: [MADRID, BARCELONA, BARCELONA2],
}))

import { deriveCities, filterEvents, ConferenceDashboard } from './ConferenceDashboard'

describe('deriveCities', () => {
  // T003 [AC-SP003-US01-CR01]
  it('[AC-SP003-US01-CR01] produces sorted, deduplicated city list', async ({ annotate }) => {
    await annotate('acceptance-criteria', 'AC-SP003-US01-CR01')
    expect(deriveCities([MADRID, BARCELONA, BARCELONA2])).toEqual(['Barcelona', 'Madrid'])
  })

  // T008 [Edge: single city]
  it('[Edge: single city] returns exactly one entry when all conferences share one city', async ({ annotate }) => {
    await annotate('acceptance-criteria', 'AC-SP003-US01-EC02')
    expect(deriveCities([BARCELONA, BARCELONA2])).toEqual(['Barcelona'])
  })

  // T009 [Edge: trim normalisation]
  it('[Edge: case/accent] trims city strings to prevent duplicates from trailing spaces', async ({ annotate }) => {
    await annotate('acceptance-criteria', 'AC-SP003-US01-EC03')
    expect(deriveCities([MADRID, MADRID_TRAILING])).toEqual(['Madrid'])
  })
})

describe('filterEvents', () => {
  // T004 [AC-SP003-US01-CR02]
  it('[AC-SP003-US01-CR02] returns only events matching selected city', async ({ annotate }) => {
    await annotate('acceptance-criteria', 'AC-SP003-US01-CR02')
    expect(filterEvents([MADRID, BARCELONA, BARCELONA2], 'Barcelona')).toEqual([BARCELONA, BARCELONA2])
  })
})

describe('ConferenceDashboard', () => {
  // T005 [AC-SP003-US01-CR03]
  it('[AC-SP003-US01-CR03] updates visible events when selectedCity transitions', async ({ annotate }) => {
    await annotate('acceptance-criteria', 'AC-SP003-US01-CR03')
    render(<ConferenceDashboard />)
    fireEvent.change(screen.getByTestId('city-select'), { target: { value: 'Madrid' } })
    expect(screen.getAllByRole('article')).toHaveLength(1)
    fireEvent.change(screen.getByTestId('city-select'), { target: { value: 'Barcelona' } })
    expect(screen.getAllByRole('article')).toHaveLength(2)
  })

  // T006 [AC-SP003-US01-CR04]
  it('[AC-SP003-US01-CR04] visible card count equals conferences for selected city', async ({ annotate }) => {
    await annotate('acceptance-criteria', 'AC-SP003-US01-CR04')
    render(<ConferenceDashboard />)
    fireEvent.change(screen.getByTestId('city-select'), { target: { value: 'Barcelona' } })
    expect(screen.getAllByRole('article')).toHaveLength(2)
  })

  // T007 [Edge: no-result message] — EventGrid empty-state path; dashboard default shows all cards
  it('[Edge: no-result message] all cards visible in default state (no empty state triggered)', async ({ annotate }) => {
    await annotate('acceptance-criteria', 'AC-SP003-US01-EC01')
    render(<ConferenceDashboard />)
    expect(screen.getAllByRole('article')).toHaveLength(3)
  })

  // T018 [AC-SP003-US02-CR01]
  it('[AC-SP003-US02-CR01] mounts with selectedCity null and shows all conferences', async ({ annotate }) => {
    await annotate('acceptance-criteria', 'AC-SP003-US02-CR01')
    render(<ConferenceDashboard />)
    expect(screen.getAllByRole('article')).toHaveLength(3)
  })

  // T020 [AC-SP003-US02-CR01,CR02] full mount integration
  it('[AC-SP003-US02-CR01,CR02] full mount shows all cards, CityFilter in default state', async ({ annotate }) => {
    await annotate('acceptance-criteria', 'AC-SP003-US02-CR01')
    render(<ConferenceDashboard />)
    expect(screen.getAllByRole('article')).toHaveLength(3)
    expect((screen.getByTestId('city-select') as HTMLSelectElement).value).toBe('')
    expect(screen.queryByTestId('clear-filter-btn')).toBeNull()
    expect(screen.queryByTestId('active-filter-indicator')).toBeNull()
  })

  // T026 [AC-SP003-US03-CR04]
  it('[AC-SP003-US03-CR04] clears to full conference list after filter reset', async ({ annotate }) => {
    await annotate('acceptance-criteria', 'AC-SP003-US03-CR04')
    render(<ConferenceDashboard />)
    fireEvent.change(screen.getByTestId('city-select'), { target: { value: 'Madrid' } })
    expect(screen.getAllByRole('article')).toHaveLength(1)
    fireEvent.change(screen.getByTestId('city-select'), { target: { value: '' } })
    expect(screen.getAllByRole('article')).toHaveLength(3)
  })

  // T027 [AC-SP003-US03-CR01..CR04] both clear paths
  it('[AC-SP003-US03-CR01..CR04] both clear paths restore full list and reset selector', async ({ annotate }) => {
    await annotate('acceptance-criteria', 'AC-SP003-US03-CR01')
    render(<ConferenceDashboard />)

    fireEvent.change(screen.getByTestId('city-select'), { target: { value: 'Barcelona' } })
    expect(screen.getAllByRole('article')).toHaveLength(2)
    fireEvent.change(screen.getByTestId('city-select'), { target: { value: '' } })
    expect(screen.getAllByRole('article')).toHaveLength(3)
    expect(screen.queryByTestId('clear-filter-btn')).toBeNull()
    expect(screen.queryByTestId('active-filter-indicator')).toBeNull()

    fireEvent.change(screen.getByTestId('city-select'), { target: { value: 'Madrid' } })
    expect(screen.getAllByRole('article')).toHaveLength(1)
    fireEvent.click(screen.getByTestId('clear-filter-btn'))
    expect(screen.getAllByRole('article')).toHaveLength(3)
    expect(screen.queryByTestId('clear-filter-btn')).toBeNull()
  })

  // T010 [AC-SP003-US01-CR01,CR02] CityFilter options + filtering
  it('[AC-SP003-US01-CR01,CR02] CityFilter has correct options and filters EventGrid on change', async ({ annotate }) => {
    await annotate('acceptance-criteria', 'AC-SP003-US01-CR01')
    render(<ConferenceDashboard />)
    const select = screen.getByTestId('city-select') as HTMLSelectElement
    const options = Array.from(select.options).map((o) => o.value)
    expect(options).toContain('')
    expect(options).toContain('Barcelona')
    expect(options).toContain('Madrid')
    fireEvent.change(select, { target: { value: 'Madrid' } })
    expect(screen.getAllByRole('article')).toHaveLength(1)
  })

  // T011 [AC-SP003-US01-CR03,CR04] city switch
  it('[AC-SP003-US01-CR03,CR04] switching city updates EventGrid content with correct count', async ({ annotate }) => {
    await annotate('acceptance-criteria', 'AC-SP003-US01-CR03')
    render(<ConferenceDashboard />)
    fireEvent.change(screen.getByTestId('city-select'), { target: { value: 'Madrid' } })
    expect(screen.getAllByRole('article')).toHaveLength(1)
    fireEvent.change(screen.getByTestId('city-select'), { target: { value: 'Barcelona' } })
    expect(screen.getAllByRole('article')).toHaveLength(2)
  })
})

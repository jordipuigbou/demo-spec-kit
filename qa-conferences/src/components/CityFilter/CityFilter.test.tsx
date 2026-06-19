import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { CityFilter } from './CityFilter'

const cities = ['Barcelona', 'Madrid', 'Seville', 'Valencia']

describe('CityFilter', () => {
  // T019 [AC-SP003-US02-CR02] default state
  it('[AC-SP003-US02-CR02] renders with no selection, no clear button, no indicator when selectedCity is null', async ({
    annotate,
  }) => {
    await annotate('acceptance-criteria', 'AC-SP003-US02-CR02')
    render(<CityFilter cities={cities} selectedCity={null} onChange={vi.fn()} />)
    expect((screen.getByTestId('city-select') as HTMLSelectElement).value).toBe('')
    expect(screen.queryByTestId('clear-filter-btn')).toBeNull()
    expect(screen.queryByTestId('active-filter-indicator')).toBeNull()
  })

  // T023 [AC-SP003-US03-CR01] onChange(null) when "All cities" selected
  it('[AC-SP003-US03-CR01] calls onChange(null) when user selects the All cities option', async ({
    annotate,
  }) => {
    await annotate('acceptance-criteria', 'AC-SP003-US03-CR01')
    const onChange = vi.fn()
    render(<CityFilter cities={cities} selectedCity="Madrid" onChange={onChange} />)
    fireEvent.change(screen.getByTestId('city-select'), { target: { value: '' } })
    expect(onChange).toHaveBeenCalledWith(null)
  })

  // T024 [AC-SP003-US03-CR02] onChange(null) when clear button clicked
  it('[AC-SP003-US03-CR02] calls onChange(null) when Clear filter button is clicked', async ({
    annotate,
  }) => {
    await annotate('acceptance-criteria', 'AC-SP003-US03-CR02')
    const onChange = vi.fn()
    render(<CityFilter cities={cities} selectedCity="Madrid" onChange={onChange} />)
    fireEvent.click(screen.getByTestId('clear-filter-btn'))
    expect(onChange).toHaveBeenCalledWith(null)
  })

  // T025 [AC-SP003-US03-CR03] after clear, no button or indicator
  it('[AC-SP003-US03-CR03] clear button and indicator are absent when selectedCity is null', async ({
    annotate,
  }) => {
    await annotate('acceptance-criteria', 'AC-SP003-US03-CR03')
    const { rerender } = render(
      <CityFilter cities={cities} selectedCity="Madrid" onChange={vi.fn()} />,
    )
    rerender(<CityFilter cities={cities} selectedCity={null} onChange={vi.fn()} />)
    expect(screen.queryByTestId('clear-filter-btn')).toBeNull()
    expect(screen.queryByTestId('active-filter-indicator')).toBeNull()
  })

  // T030 [AC-SP003-US04-CR01] indicator present when city selected
  it('[AC-SP003-US04-CR01] renders active-filter-indicator when selectedCity is set', async ({
    annotate,
  }) => {
    await annotate('acceptance-criteria', 'AC-SP003-US04-CR01')
    render(<CityFilter cities={cities} selectedCity="Barcelona" onChange={vi.fn()} />)
    expect(screen.getByTestId('active-filter-indicator')).toBeTruthy()
  })

  // T031 [AC-SP003-US04-CR02] indicator text contains selected city
  it('[AC-SP003-US04-CR02] active-filter-indicator text contains the selected city name', async ({
    annotate,
  }) => {
    await annotate('acceptance-criteria', 'AC-SP003-US04-CR02')
    render(<CityFilter cities={cities} selectedCity="Seville" onChange={vi.fn()} />)
    expect(screen.getByTestId('active-filter-indicator').textContent).toContain('Seville')
  })

  // T032 [AC-SP003-US04-CR03] indicator absent when no city selected
  it('[AC-SP003-US04-CR03] does not render active-filter-indicator when selectedCity is null', async ({
    annotate,
  }) => {
    await annotate('acceptance-criteria', 'AC-SP003-US04-CR03')
    render(<CityFilter cities={cities} selectedCity={null} onChange={vi.fn()} />)
    expect(screen.queryByTestId('active-filter-indicator')).toBeNull()
  })

  // T033 [Edge: long city name] indicator has truncation utility class
  it('[Edge: long city name] active-filter-indicator has truncate class for long city names', async ({
    annotate,
  }) => {
    await annotate('acceptance-criteria', 'AC-SP003-US04-EC01')
    const longCity = 'A'.repeat(60)
    render(<CityFilter cities={[longCity]} selectedCity={longCity} onChange={vi.fn()} />)
    const indicator = screen.getByTestId('active-filter-indicator')
    expect(indicator.className).toMatch(/truncate|break-words/)
  })
})

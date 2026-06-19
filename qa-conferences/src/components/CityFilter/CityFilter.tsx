'use client'

interface CityFilterProps {
  cities: string[]
  selectedCity: string | null
  onChange: (city: string | null) => void
}

export function CityFilter({ cities, selectedCity, onChange }: CityFilterProps) {
  return (
    <div data-testid="city-filter">
      <select
        id="city-select"
        aria-label="City filter"
        data-testid="city-select"
        value={selectedCity ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? null : e.target.value)}
      >
        <option value="">All cities</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
      {selectedCity && (
        <button data-testid="clear-filter-btn" onClick={() => onChange(null)}>
          Clear filter
        </button>
      )}
      {selectedCity && (
        <p data-testid="active-filter-indicator" className="truncate">
          {selectedCity}
        </p>
      )}
    </div>
  )
}

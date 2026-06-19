# Component Contract: `CityFilter`

**Feature**: 003-city-filter | **Date**: 2026-06-19

## Props Interface

```ts
interface CityFilterProps {
  /** Alphabetically sorted list of distinct city names derived from conference data. */
  cities: string[]
  /** Currently selected city, or null when no filter is active. */
  selectedCity: string | null
  /** Called with the new city string when user selects a city, or null when cleared. */
  onChange: (city: string | null) => void
}
```

## Rendered Structure

```
<div data-testid="city-filter">
  <label htmlFor="city-select">Filter by city</label>
  <select id="city-select" data-testid="city-select">
    <option value="">All cities</option>
    {cities.map(city => <option key={city} value={city}>{city}</option>)}
  </select>
  {selectedCity && (
    <button data-testid="clear-filter-btn" onClick={() => onChange(null)}>
      Clear filter
    </button>
  )}
  {selectedCity && (
    <p data-testid="active-filter-indicator">
      Showing conferences in: {selectedCity}
    </p>
  )}
</div>
```

## Behaviour Contracts

| Scenario | Input | Expected Output |
|----------|-------|-----------------|
| Default render | `selectedCity=null` | Select shows "All cities"; no clear button; no indicator |
| City selected | `selectedCity="Barcelona"` | Select shows "Barcelona"; clear button visible; indicator shows "Barcelona" |
| User picks city | User selects "Madrid" | `onChange("Madrid")` called |
| User picks "All cities" | User selects `value=""` | `onChange(null)` called |
| User clicks clear | Click `clear-filter-btn` | `onChange(null)` called |
| Cities list order | `cities=["Madrid","Barcelona"]` | Options rendered in same order as array (caller sorts) |

## Accessibility Requirements

- `<select>` MUST have an associated `<label>` (via `htmlFor` / `id`).
- Clear button MUST have a visible text label (not icon-only).
- Active filter indicator MUST be readable by screen readers (no `aria-hidden`).

## Data Test IDs

| Element | `data-testid` |
|---------|---------------|
| Root container | `city-filter` |
| Select element | `city-select` |
| Clear filter button | `clear-filter-btn` |
| Active filter indicator | `active-filter-indicator` |

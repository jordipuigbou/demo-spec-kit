# Data Model: Filter Conferences by City

**Feature**: 003-city-filter | **Date**: 2026-06-19

## Existing Entity: `ConferenceEvent`

Defined in `qa-conferences/src/types/conference.ts`. No changes required.

```ts
interface ConferenceEvent {
  id: string       // stable unique identifier
  name: string     // display name of the conference
  date: string     // ISO 8601 date string
  city: string     // filtering key — used to populate selector and apply filter
  imageUrl: string
  imageAlt: string
}
```

The `city` field is the sole filtering attribute for this feature.

---

## New Transient State: `CityFilterSelection`

This is UI state, not a persisted entity. It lives in a React `useState` hook inside `ConferenceDashboard`.

| State value | Meaning |
|-------------|---------|
| `null` | No filter active; all conferences shown (default) |
| `string` (city name) | Only conferences where `event.city === selectedCity` are shown |

```ts
const [selectedCity, setSelectedCity] = useState<string | null>(null)
```

**Validation rules**:
- Value MUST be `null` or a string that exists in the derived city list.
- The selector only presents valid options; no free-text input exists.

**State transitions**:

```
null ──[select city]──► "Barcelona"
"Barcelona" ──[select "All cities" or clear button]──► null
"Barcelona" ──[select different city]──► "Madrid"
```

---

## Derived Data: City List

Computed at render time from `CONFERENCES`. Not stored — derived on demand.

```ts
const cities: string[] = Array.from(
  new Set(CONFERENCES.map(e => e.city.trim()))
).sort((a, b) => a.localeCompare(b, 'es'))
// ponytail: trim-only normalisation; full Unicode folding if dataset grows inconsistent
```

The selector prepends an "All cities" sentinel (maps to `null` state) before these entries.

---

## Derived Data: Filtered Events

```ts
const filteredEvents: ConferenceEvent[] = selectedCity
  ? CONFERENCES.filter(e => e.city === selectedCity)
  : CONFERENCES
```

---

## Component Responsibility Summary

| Component | Owns | Receives |
|-----------|------|----------|
| `ConferenceDashboard` | `selectedCity` state, `filteredEvents`, `cities` | `CONFERENCES` (prop or import) |
| `CityFilter` | — | `cities`, `selectedCity`, `onChange` |
| `EventGrid` | — | `filteredEvents` |

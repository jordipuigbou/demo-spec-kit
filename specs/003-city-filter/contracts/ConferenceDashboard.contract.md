# Component Contract: `ConferenceDashboard`

**Feature**: 003-city-filter | **Date**: 2026-06-19

## Props Interface

```ts
// No props — owns state and imports CONFERENCES directly
```

This is the stateful root of the dashboard. It replaces the inline content of `src/app/page.tsx` and must be a Client Component (`'use client'`).

## State

| State variable | Type | Initial value | Description |
|----------------|------|---------------|-------------|
| `selectedCity` | `string \| null` | `null` | Currently active city filter |

## Rendered Structure

```
<div>
  <h1>Conferencias QA en España</h1>
  <p>Próximos eventos de calidad y testing en España</p>
  <CityFilter
    cities={cities}
    selectedCity={selectedCity}
    onChange={setSelectedCity}
  />
  <EventGrid events={filteredEvents} />
</div>
```

## Behaviour Contracts

| Scenario | Expectation |
|----------|-------------|
| Mount | `selectedCity` is `null`; all conferences passed to `EventGrid` |
| `onChange("Madrid")` called | `selectedCity` becomes `"Madrid"`; only Madrid conferences in `filteredEvents` |
| `onChange(null)` called | `selectedCity` becomes `null`; all conferences in `filteredEvents` |
| `cities` derived value | Distinct, sorted A→Z, from `CONFERENCES`; no duplicates |
| `filteredEvents` when no filter | Identical reference or equal array to `CONFERENCES` |
| `filteredEvents` when filter active | Only events where `event.city === selectedCity` |

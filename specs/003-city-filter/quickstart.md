# Quickstart Validation Guide: Filter Conferences by City

**Feature**: 003-city-filter | **Date**: 2026-06-19

## Prerequisites

- Node.js ≥ 18 installed
- Dependencies installed: `cd qa-conferences && npm install`

---

## Running Unit & Integration Tests

```bash
cd qa-conferences
npm run test:ci
```

Reports written to:
- `reports/unit/junit.xml` — JUnit XML (CI gate)
- `reports/unit/html/index.html` — Human-readable HTML

### Expected: All tests green, coverage thresholds met

---

## Running E2E Tests

```bash
cd qa-conferences
npm run test:e2e
```

The Playwright config auto-starts `npm run dev` on port 3000.

Reports written to:
- `reports/e2e/junit.xml`
- `reports/e2e/html/index.html`

---

## Manual Validation Scenarios

Start the dev server:

```bash
cd qa-conferences && npm run dev
# Open http://localhost:3000
```

### Scenario 1 — Default unfiltered state (US2)

1. Open `http://localhost:3000` in a browser.
2. Verify: City selector is visible above the conference grid, showing "All cities".
3. Verify: All conference cards from all cities are visible.
4. Verify: No active-filter indicator is shown.

### Scenario 2 — Filter by city (US1)

1. Open the city selector drop-down.
2. Verify: Each city present in the data appears exactly once, sorted A→Z, with "All cities" at the top.
3. Select "Barcelona".
4. Verify: Only Barcelona conferences remain visible; conferences from other cities are hidden.
5. Verify: Active-filter indicator appears and names "Barcelona".

### Scenario 3 — Switch city (US1, AC3)

1. With "Barcelona" selected, open the selector and choose "Madrid".
2. Verify: Only Madrid conferences are shown; Barcelona conferences are hidden.
3. Verify: Active-filter indicator updates to "Madrid".

### Scenario 4 — Clear via "All cities" (US3)

1. With a city filter active, open the selector and choose "All cities".
2. Verify: All conferences from all cities are shown again.
3. Verify: Active-filter indicator is gone.
4. Verify: Selector shows "All cities" state.

### Scenario 5 — Clear via explicit button (US3)

1. With a city filter active, click the "Clear filter" button visible next to the selector.
2. Verify: Same result as Scenario 4.

### Scenario 6 — Responsive layout (SC-007)

1. Using browser DevTools, resize viewport to 375 px width.
2. Apply a city filter.
3. Verify: Selector, indicator, and filtered card grid render without layout breakage.
4. Resize to 1440 px and verify again.

---

## AC Coverage Quick-Check

| AC ID | User Story | Covered By |
|-------|-----------|------------|
| SP003-US01-CR01 | US1 AC1 — cities listed once | Unit: `CityFilter`, E2E: dashboard.spec |
| SP003-US01-CR02 | US1 AC2 — filter hides others | Unit: `ConferenceDashboard`, E2E |
| SP003-US01-CR03 | US1 AC3 — switch city | Unit: `ConferenceDashboard`, E2E |
| SP003-US01-CR04 | US1 AC4 — count matches | Unit: `ConferenceDashboard` |
| SP003-US02-CR01 | US2 AC1 — default unfiltered | Unit: `ConferenceDashboard`, E2E |
| SP003-US02-CR02 | US2 AC2 — no filter applied | Unit: `ConferenceDashboard` |
| SP003-US03-CR01 | US3 AC1 — clear via "All cities" | Unit: `CityFilter`, E2E |
| SP003-US03-CR02 | US3 AC2 — clear via button | Unit: `CityFilter`, E2E |
| SP003-US03-CR03 | US3 AC3 — selector resets | Unit: `CityFilter` |
| SP003-US03-CR04 | US3 AC4 — identical to default | Unit: `ConferenceDashboard` |
| SP003-US04-CR01 | US4 AC1 — indicator shown | Unit: `CityFilter` |
| SP003-US04-CR02 | US4 AC2 — indicator names city | Unit: `CityFilter` |
| SP003-US04-CR03 | US4 AC3 — indicator absent by default | Unit: `CityFilter` |

See [data-model.md](data-model.md) for state and entity definitions.
See [contracts/CityFilter.contract.md](contracts/CityFilter.contract.md) and [contracts/ConferenceDashboard.contract.md](contracts/ConferenceDashboard.contract.md) for component contracts.

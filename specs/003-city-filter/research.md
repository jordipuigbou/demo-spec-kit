# Research: Filter Conferences by City

**Feature**: 003-city-filter | **Date**: 2026-06-19

## Decision Log

### State Management Approach

**Decision**: React `useState` in the page component (`src/app/page.tsx`), passed down as props.

**Rationale**: The filter is transient UI state scoped to a single page. No persistence required, no cross-page sharing. A client component with `useState` is the minimal correct solution.

**Alternatives considered**: URL search params (adds persistence, overkill per spec assumptions), Zustand/Context (adds a dependency for one piece of state, rejected by ponytail ladder rung 4).

---

### Drop-down Component Strategy

**Decision**: Native `<select>` element styled with Tailwind, wrapped in a `CityFilter` component.

**Rationale**: FR-010 requires desktop + mobile usability. Native `<select>` provides that for free, with built-in accessibility (keyboard nav, screen reader labels) and no extra JS. The spec does not require an autocomplete or multi-select; a plain select fulfils every requirement.

**Alternatives considered**: Custom dropdown/combobox (unnecessary complexity, adds JS, accessibility burden). Headless UI / Radix Select (adds a dependency for a case native HTML covers — ladder rung 3).

---

### "Clear filter" Control

**Decision**: A `<button>` rendered conditionally when a city is active, alongside the select.

**Rationale**: FR-006 requires two clearing paths: "All cities" entry at top of dropdown + explicit clear button. The button is a simple conditional render in the same component.

**Alternatives considered**: X-icon only (accessibility issue, rejected), reset link (same function, button is semantically clearer).

---

### Active Filter Indicator

**Decision**: A `<p>` or `<span>` rendered conditionally below/beside the selector showing the selected city name.

**Rationale**: FR-007/FR-008 require a visible indicator that appears only when a city is active. A simple conditional text element with Tailwind styling is sufficient; no animation library needed.

---

### City List Derivation

**Decision**: Compute distinct, sorted cities from `CONFERENCES` array at build/render time using `Array.from(new Set(...)).sort()`, with "All cities" prepended.

**Rationale**: FR-003 requires distinct, alphabetically sorted cities. The data is static and already in scope — one expression covers it. No memoization needed for a static list, but `useMemo` can be added if data ever becomes dynamic.

**Alternatives considered**: Pre-computed constant in `data/` (adds a file that goes stale if data changes, rejected).

---

### Testing Strategy

**Decision**: Vitest + React Testing Library for unit/integration tests; Playwright for E2E.

**Rationale**: Already installed and configured. Vitest ≥4.1 is present (`^4.1.8`), enabling `context.annotate` for AC traceability. Playwright covers P1 user stories at E2E level per constitution Principle II.

**AC annotation method**: `await annotate('acceptance-criteria', 'SP003-USXX-CRYY')` in Vitest tests; Playwright `tag` API for E2E.

---

### Next.js Client Component

**Decision**: The page (`src/app/page.tsx`) must become a Client Component (`'use client'`) since it will hold `useState`. Alternatively, extract a `ConferenceDashboard` client component and keep the page as a Server Component.

**Decision refined**: Extract a `ConferenceDashboard` client component — keeps the page as a Server Component (better for Next.js streaming/SSR compatibility) and isolates the stateful logic.

---

### Normalisation for Case/Accent Consistency (Edge Case)

**Decision**: Normalise city strings with `.trim()` before deduplication. Full locale-aware accent folding is deferred — current dataset uses consistent casing; the spec requires consistent treatment but does not mandate Unicode normalisation beyond what the data requires.

**Rationale**: The data is controlled and static. Over-engineering Unicode normalisation for a static Spanish city list adds complexity with no current payoff. A `// ponytail:` note will mark the ceiling.

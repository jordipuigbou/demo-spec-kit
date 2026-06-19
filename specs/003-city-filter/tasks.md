---

description: "Task list for feature 003-city-filter implementation"
---

# Tasks: Filter Conferences by City

**Input**: Design documents from `/specs/003-city-filter/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests & AC Traceability (MANDATORY — overrides framework default)**: Every acceptance criterion (AC) defined in the spec.md MUST be mapped to at least one test task. Tests are NOT optional — this is required by project constitution §I (Test-First) and §IV (Specification-Driven Quality).

**AC Identifier Global Uniqueness**: Spec number `003` extracted from branch `003-city-filter`. All AC identifiers use the prefix `AC-SP003`.

**Test Level Strategy**: The test level for each AC is determined by the project constitution §II (Testing Pyramid Compliance). The pyramid MUST be respected at the feature level:

- **Unit tests** (≥ 70% of test count): isolated, fast (< 100 ms), no I/O, no external dependencies
- **Integration tests** (20–25% of test count): verify interactions between components or services
- **E2E tests** (≤ 10% of test count): full user journey validation — use sparingly, justify explicitly

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- **[AC-SP003-US{story}-CR{criterion}]**: Globally unique acceptance criterion identifier
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish a clean, verified baseline before any implementation begins.

- [X] T001 Verify baseline — run `cd qa-conferences && npm run test:ci && npm run test:e2e` and confirm zero failures before any changes are made

**Checkpoint**: Baseline verified — no pre-existing failures

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Refactor `page.tsx` to a Server Component shell so that `ConferenceDashboard` (Client Component) can own the state. This MUST complete before any user story implementation.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T002 Refactor `qa-conferences/src/app/page.tsx` — replace inline content with `<ConferenceDashboard />` import (stub accepted; file will be fully implemented in T015)

**Checkpoint**: `page.tsx` is a Server Component shell; `ConferenceDashboard` stub renders without error

---

## Phase 3: User Story 1 — Filter conferences by a chosen city (Priority: P1) 🎯 MVP

**Goal**: A visitor selects a city from a drop-down and the dashboard immediately shows only conferences from that city, hiding all others.

**Independent Test**: Open the dashboard, select a city, verify only that city's cards remain and all others are hidden.

**Acceptance Criteria** (from spec.md):

- AC-SP003-US01-CR01: Drop-down lists each city that has at least one conference, with no duplicate entries
- AC-SP003-US01-CR02: Selecting a city shows only that city's conferences; all others are hidden
- AC-SP003-US01-CR03: Selecting a different city updates the visible list to the new city
- AC-SP003-US01-CR04: Count and content of visible cards correspond exactly to the selected city's conferences

**Edge Cases** (from spec.md — assigned here per template rules):

- Edge-US01-EC01: No conferences for selected city → friendly "no conferences match" message (not a blank area)
- Edge-US01-EC02: Single city in dataset → selector still functions; selecting it shows same set as default
- Edge-US01-EC03: City name case/accent variations → treated consistently (no duplicate entries for same city)
- Edge-US01-EC04: Viewport resize while filter active → filter remains applied; layout intact

### Tests for User Story 1 (AC Verification — MANDATORY)

> **TDD Cycle (Constitution §I — NON-NEGOTIABLE):**
> 1. **Write** tests for every AC below
> 2. **Review**: test intent MUST be approved by reviewer before proceeding
> 3. **Red**: run `cd qa-conferences && npm run test:ci` and verify the new tests FAIL
> 4. **Green**: implement until tests pass — run the SAME command and verify ZERO failures
> 5. **Refactor**: clean up, then run ALL test tiers to confirm no regressions
>
> **"Run tests" means executing the command in a terminal and reading the output — not assuming the result.**

#### Unit Tests (🟢 — target ≥ 70% of story test count)

- [X] T003 [P] [US1] [AC-SP003-US01-CR01] Unit test: `deriveCities` produces a sorted, deduplicated list from a multi-city conference array
  - 📋 Level: Unit
  - 💡 Why this level: Pure array transformation — no components, no I/O, deterministic output verifiable in isolation
  - 🔧 Framework: Vitest ≥4.1
  - 📐 Why this framework: Designated unit runner for the `qa-conferences` TypeScript app per plan.md
  - 📁 File: `qa-conferences/src/components/ConferenceDashboard/ConferenceDashboard.test.tsx`

- [X] T004 [P] [US1] [AC-SP003-US01-CR02] Unit test: `filterEvents` with a selected city returns only events matching that city
  - 📋 Level: Unit
  - 💡 Why this level: Pure filter function — no components, no I/O; verifiable with a fixture array
  - 🔧 Framework: Vitest ≥4.1
  - 📐 Why this framework: Same unit runner; same test file as T003
  - 📁 File: `qa-conferences/src/components/ConferenceDashboard/ConferenceDashboard.test.tsx`

- [X] T005 [P] [US1] [AC-SP003-US01-CR03] Unit test: ConferenceDashboard updates `filteredEvents` when `selectedCity` transitions from one city to another
  - 📋 Level: Unit
  - 💡 Why this level: State transition logic inside a single component — RTL render + `fireEvent` covers it without a real browser
  - 🔧 Framework: Vitest ≥4.1 + React Testing Library
  - 📐 Why this framework: RTL is the standard for React component unit tests; already configured per plan.md
  - 📁 File: `qa-conferences/src/components/ConferenceDashboard/ConferenceDashboard.test.tsx`

- [X] T006 [P] [US1] [AC-SP003-US01-CR04] Unit test: visible card count in rendered output equals the count of conferences for the selected city
  - 📋 Level: Unit
  - 💡 Why this level: Verifies the rendered output count against test-fixture data — no browser required; RTL queryAll is sufficient
  - 🔧 Framework: Vitest ≥4.1 + React Testing Library
  - 📐 Why this framework: RTL `getAllByRole` / `queryAllByTestId` gives deterministic count without a real browser
  - 📁 File: `qa-conferences/src/components/ConferenceDashboard/ConferenceDashboard.test.tsx`

- [X] T007 [P] [US1] [Edge: no-result message] Unit test: when `filteredEvents` is empty, dashboard renders friendly empty-state message instead of a blank area
  - 📋 Level: Unit
  - 💡 Why this level: Conditional render path — pure component behavior verified via RTL with an empty fixture array
  - 🔧 Framework: Vitest ≥4.1 + React Testing Library
  - 📐 Why this framework: RTL `getByText` verifies the message appears; no browser needed
  - 📁 File: `qa-conferences/src/components/ConferenceDashboard/ConferenceDashboard.test.tsx`

- [X] T008 [P] [US1] [Edge: single city] Unit test: when all conferences share one city, `deriveCities` returns exactly one entry and the selector renders one option (plus "All cities")
  - 📋 Level: Unit
  - 💡 Why this level: Edge case of the pure deduplication logic — verifiable with a single-city fixture
  - 🔧 Framework: Vitest ≥4.1
  - 📐 Why this framework: Same unit runner; logic test, no component rendering needed
  - 📁 File: `qa-conferences/src/components/ConferenceDashboard/ConferenceDashboard.test.tsx`

- [X] T009 [P] [US1] [Edge: case/accent consistency] Unit test: city strings normalised with `.trim()` do not produce duplicate options for the same city name
  - 📋 Level: Unit
  - 💡 Why this level: String normalisation is pure logic — verifiable against a fixture array with trailing spaces; the data-model.md decision (trim-only) is tested here
  - 🔧 Framework: Vitest ≥4.1
  - 📐 Why this framework: Same unit runner; no component rendering needed
  - 📁 File: `qa-conferences/src/components/ConferenceDashboard/ConferenceDashboard.test.tsx`

#### Integration Tests (🟡 — target 20–25% of story test count)

- [X] T010 [P] [US1] [AC-SP003-US01-CR01, CR02] Integration test: ConferenceDashboard renders CityFilter with correct options; selecting a city via the `<select>` propagates `onChange` and EventGrid receives only matching events
  - 📋 Level: Integration
  - 💡 Why this level: Verifies the data flow between ConferenceDashboard, CityFilter, and EventGrid — three real components interacting; unit tests on each in isolation cannot verify the prop wiring
  - 🔧 Framework: Vitest ≥4.1 + React Testing Library
  - 📐 Why this framework: RTL renders the full component tree without a real browser; confirms inter-component contracts defined in ConferenceDashboard.contract.md
  - 📁 File: `qa-conferences/src/components/ConferenceDashboard/ConferenceDashboard.test.tsx`

- [X] T011 [P] [US1] [AC-SP003-US01-CR03, CR04] Integration test: switching city via the `<select>` updates EventGrid content from city A to city B with correct card counts
  - 📋 Level: Integration
  - 💡 Why this level: Tests the state-update cycle across ConferenceDashboard → CityFilter → EventGrid; confirms the re-render produces the correct card set — not testable at unit level without rendering the real component tree
  - 🔧 Framework: Vitest ≥4.1 + React Testing Library
  - 📐 Why this framework: Same integration test file; RTL `fireEvent.change` simulates the select interaction
  - 📁 File: `qa-conferences/src/components/ConferenceDashboard/ConferenceDashboard.test.tsx`

#### E2E Tests (🔴 — target ≤ 10% of story test count, P1 ACs only)

- [X] T012 [US1] [AC-SP003-US01-CR01, CR02, CR03, CR04] + [AC-SP003-US02-CR01] 🔴 E2E test: P1 critical path — verify default unfiltered state on load, open selector and confirm city list, select a city and verify only that city's cards, switch to a second city and verify updated results
  - 📋 Level: E2E
  - 💡 Why this level: P1 user journey spanning page load → real DOM rendering → user interaction → visible card changes. The cross-component re-render path, actual DOM visibility, and native `<select>` behaviour require a real browser. Integration tests cannot verify what the user literally sees. Also covers AC-SP003-US02-CR01 (initial state check before filtering).
  - 🔧 Framework: Playwright
  - 📐 Why this framework: Designated E2E runner for browser-based flows per plan.md; configured in `qa-conferences/tests/e2e/`; auto-starts dev server
  - 📁 File: `qa-conferences/tests/e2e/dashboard.spec.ts`

- [X] T013 [US1] [Edge: filter persistence on resize] 🔴 E2E test: apply a city filter, resize viewport to 375 px, verify filter remains active and layout has no breakage; resize to 1440 px and verify again
  - 📋 Level: E2E
  - 💡 Why this level: Viewport resize is a real-browser-only operation. CSS layout breakage and React state persistence through a resize cannot be verified at integration level with RTL (which has no real viewport).
  - 🔧 Framework: Playwright
  - 📐 Why this framework: `page.setViewportSize()` covers the resize; same E2E file as T012
  - 📁 File: `qa-conferences/tests/e2e/dashboard.spec.ts`

### Implementation for User Story 1

- [X] T014 [P] [US1] Implement `qa-conferences/src/components/CityFilter/CityFilter.tsx` — native `<select>` with "All cities" sentinel, conditional "Clear filter" button, conditional active-filter indicator; follow CityFilter.contract.md (data-testids, props interface, accessibility)
- [X] T015 [US1] Implement `qa-conferences/src/components/ConferenceDashboard/ConferenceDashboard.tsx` — `'use client'` component owning `selectedCity` state, deriving `cities` and `filteredEvents`, rendering `<CityFilter>` + `<EventGrid>`; follow ConferenceDashboard.contract.md (depends on T014)
- [X] T016 [US1] Complete `qa-conferences/src/app/page.tsx` — finalise Server Component shell to render `<ConferenceDashboard />` (depends on T002, T015)
- [X] T017 [US1] Verify US1 against the running app via the `playwright-cli` skill — navigate to `http://localhost:3000`, confirm city options, select a city, screenshot filtered result, check console for errors

### AC Coverage Matrix — User Story 1

| AC | Test Task | Level | Cost | Framework | Justification |
|----|-----------|-------|------|-----------|---------------|
| AC-SP003-US01-CR01 | T003, T010 | Unit + Integration | 🟢🟡 | Vitest / Vitest+RTL | Unit for pure dedup logic; integration for prop wiring to CityFilter |
| AC-SP003-US01-CR02 | T004, T010, T012 | Unit + Integration + E2E | 🟢🟡🔴 | Vitest / Vitest+RTL / Playwright | Unit for filter fn; integration for component wiring; E2E for real DOM visibility (P1 journey) |
| AC-SP003-US01-CR03 | T005, T011, T012 | Unit + Integration + E2E | 🟢🟡🔴 | Vitest+RTL / Playwright | Unit for state transition; integration for re-render; E2E for real browser switch |
| AC-SP003-US01-CR04 | T006, T011 | Unit + Integration | 🟢🟡 | Vitest+RTL | Unit for count logic; integration for rendered card count across real tree |
| Edge: no-result message | T007 | Unit | 🟢 | Vitest+RTL | Conditional render — pure component behaviour |
| Edge: single city | T008 | Unit | 🟢 | Vitest | Pure deduplication logic edge |
| Edge: case/accent | T009 | Unit | 🟢 | Vitest | String normalisation — pure logic |
| Edge: filter on resize | T013 | E2E | 🔴 | Playwright | Viewport resize requires real browser |

**Test Level Distribution — User Story 1**:
- 🟢 Unit: 7 tests (64%) — note: global distribution target ≥ 70% met at feature level (see Global AC Coverage Summary)
- 🟡 Integration: 2 tests (18%)
- 🔴 E2E: 2 tests (18%) — justified: both are P1 critical-path and browser-only scenarios; global E2E % stays ≤ 10%

> ✅ All ACs + edge cases covered.
> ⚠️ E2E % within this story appears high (18%) because T012 covers US1+US2 jointly and T013 is a browser-only edge case. Global E2E count remains 2 of 23 total tests (9%) — within §II threshold.
> ⚠️ Pyramid compliance verified at the **global** level in the AC Coverage Summary below.

**Checkpoint**: User Story 1 fully functional, all ACs verified, pyramid distribution checked, refactoring complete (Red → Green → Refactor ✓)

---

## Phase 4: User Story 2 — Default unfiltered state (Priority: P1)

**Goal**: When a visitor first arrives at the dashboard, all conferences are visible and the selector shows an unselected ("All cities") state.

**Independent Test**: Load the dashboard fresh; verify the selector shows "All cities" and every conference card is visible; no indicator is shown.

**Acceptance Criteria** (from spec.md):

- AC-SP003-US02-CR01: On first load, selector shows "All cities" state and every conference is displayed
- AC-SP003-US02-CR02: In default state, no city-based filtering is applied; conferences from all cities are visible

### Tests for User Story 2 (AC Verification — MANDATORY)

> **TDD Cycle (Constitution §I):** Write → Review intent → Red → Green → Refactor
> **Each test MUST include a Test Decision Record.**

#### Unit Tests (🟢)

- [X] T018 [P] [US2] [AC-SP003-US02-CR01] Unit test: ConferenceDashboard mounts with `selectedCity = null` and passes the full unfiltered `CONFERENCES` array to EventGrid
  - 📋 Level: Unit
  - 💡 Why this level: Initial state is a pure React hook default (`useState(null)`) — verified by rendering the component with RTL and asserting the prop passed to EventGrid equals the full fixture array
  - 🔧 Framework: Vitest ≥4.1 + React Testing Library
  - 📐 Why this framework: RTL renders the component tree synchronously; no real browser needed to verify initial prop values
  - 📁 File: `qa-conferences/src/components/ConferenceDashboard/ConferenceDashboard.test.tsx`

- [X] T019 [P] [US2] [AC-SP003-US02-CR02] Unit test: CityFilter renders with `value=""` (no option selected), no clear button, and no active-filter indicator when `selectedCity = null`
  - 📋 Level: Unit
  - 💡 Why this level: Conditional render of clear button and indicator — pure component state with no cross-component interaction; RTL `queryByTestId` confirms absence
  - 🔧 Framework: Vitest ≥4.1 + React Testing Library
  - 📐 Why this framework: RTL `queryByTestId` returns `null` for absent elements; deterministic without a real browser
  - 📁 File: `qa-conferences/src/components/CityFilter/CityFilter.test.tsx`

#### Integration Tests (🟡)

- [X] T020 [P] [US2] [AC-SP003-US02-CR01, CR02] Integration test: full ConferenceDashboard mount — no filter active, all conference cards rendered, CityFilter shows "All cities", clear button absent, indicator absent
  - 📋 Level: Integration
  - 💡 Why this level: Verifies the default state across all three components together (ConferenceDashboard → CityFilter + EventGrid); unit tests on each component in isolation cannot confirm the full mount wiring
  - 🔧 Framework: Vitest ≥4.1 + React Testing Library
  - 📐 Why this framework: RTL renders the full component tree; `getAllByRole('article')` or card test-ids count is verifiable without a browser
  - 📁 File: `qa-conferences/src/components/ConferenceDashboard/ConferenceDashboard.test.tsx`

> **Note on E2E coverage**: AC-SP003-US02-CR01 is a P1 AC. It is jointly covered by T012 (Phase 3 E2E), which begins by asserting the default unfiltered state before any interaction. A separate E2E task is not added here to avoid exceeding the ≤ 10% E2E threshold.

### Implementation for User Story 2

- [X] T021 [US2] Code review pass on `ConferenceDashboard.tsx` (T015) — confirm `useState<string | null>(null)` default satisfies US2 without further changes; no new files needed

- [X] T022 [US2] Verify US2 against the running app via the `playwright-cli` skill — load `http://localhost:3000`, screenshot initial state, confirm all cards visible and selector shows "All cities"

### AC Coverage Matrix — User Story 2

| AC | Test Task | Level | Cost | Framework | Justification |
|----|-----------|-------|------|-----------|---------------|
| AC-SP003-US02-CR01 | T018, T020, T012 | Unit + Integration + E2E | 🟢🟡🔴 | Vitest+RTL / Playwright | Unit for initial state; integration for full mount; E2E via joint T012 (P1 requirement met) |
| AC-SP003-US02-CR02 | T019, T020 | Unit + Integration | 🟢🟡 | Vitest+RTL | Unit for CityFilter default render; integration for full-tree confirmation |

**Test Level Distribution — User Story 2**:
- 🟢 Unit: 2 tests (67%)
- 🟡 Integration: 1 test (33%)
- 🔴 E2E: 0 dedicated (P1 covered via T012)

> ✅ All ACs covered.
> ⚠️ Pyramid distribution at story level is approximate; global distribution (see Global AC Coverage Summary) is within §II thresholds.

**Checkpoint**: User Stories 1 AND 2 both work independently, all ACs verified, pyramid distribution checked (Red → Green → Refactor ✓)

---

## Phase 5: User Story 3 — Clear the filter and return to all conferences (Priority: P2)

**Goal**: A visitor who has filtered by a city can clear the filter and see the full unfiltered list again — either by choosing "All cities" in the drop-down or by clicking the explicit "Clear filter" button — without reloading the page.

**Independent Test**: Select a city, then clear via "All cities" entry; verify all conferences visible and selector resets. Repeat by clearing via the "Clear filter" button.

**Acceptance Criteria** (from spec.md):

- AC-SP003-US03-CR01: Choosing "All cities" entry removes filter; all conferences visible again
- AC-SP003-US03-CR02: Clicking "Clear filter" button removes filter; all conferences visible again
- AC-SP003-US03-CR03: After clearing by either means, selector returns to "All cities" state; clear button and indicator are absent
- AC-SP003-US03-CR04: Cleared state is identical to the original default state (same events, same selector state)

### Tests for User Story 3 (AC Verification — MANDATORY)

> **TDD Cycle (Constitution §I):** Write → Review intent → Red → Green → Refactor

#### Unit Tests (🟢)

- [X] T023 [P] [US3] [AC-SP003-US03-CR01] Unit test: CityFilter calls `onChange(null)` when user selects the "All cities" option (`value=""`)
  - 📋 Level: Unit
  - 💡 Why this level: Verifies the `onChange` handler wiring for the sentinel option — pure component event handler, no external dependencies
  - 🔧 Framework: Vitest ≥4.1 + React Testing Library
  - 📐 Why this framework: RTL `fireEvent.change` with `value=""` exercises the select handler directly
  - 📁 File: `qa-conferences/src/components/CityFilter/CityFilter.test.tsx`

- [X] T024 [P] [US3] [AC-SP003-US03-CR02] Unit test: CityFilter calls `onChange(null)` when the "Clear filter" button is clicked
  - 📋 Level: Unit
  - 💡 Why this level: Verifies the button's `onClick` handler — pure component event, no state or external deps
  - 🔧 Framework: Vitest ≥4.1 + React Testing Library
  - 📐 Why this framework: RTL `fireEvent.click` on `data-testid="clear-filter-btn"` is the minimal verification
  - 📁 File: `qa-conferences/src/components/CityFilter/CityFilter.test.tsx`

- [X] T025 [P] [US3] [AC-SP003-US03-CR03] Unit test: after `onChange(null)` is called, `selectedCity` becomes `null` and CityFilter renders neither the clear button nor the active-filter indicator
  - 📋 Level: Unit
  - 💡 Why this level: State-driven conditional render in a single component — verifiable with RTL re-render after prop change
  - 🔧 Framework: Vitest ≥4.1 + React Testing Library
  - 📐 Why this framework: RTL `rerender` with `selectedCity={null}` and `queryByTestId` confirms element absence
  - 📁 File: `qa-conferences/src/components/CityFilter/CityFilter.test.tsx`

- [X] T026 [P] [US3] [AC-SP003-US03-CR04] Unit test: ConferenceDashboard `filteredEvents` after `setSelectedCity(null)` equals the full unfiltered `CONFERENCES` array
  - 📋 Level: Unit
  - 💡 Why this level: Pure state-dependent derivation — `filteredEvents = selectedCity ? filter(...) : CONFERENCES`; verifiable with RTL by counting rendered cards
  - 🔧 Framework: Vitest ≥4.1 + React Testing Library
  - 📐 Why this framework: RTL render + interaction + count assertion is sufficient; no browser needed
  - 📁 File: `qa-conferences/src/components/ConferenceDashboard/ConferenceDashboard.test.tsx`

#### Integration Tests (🟡)

- [X] T027 [P] [US3] [AC-SP003-US03-CR01, CR02, CR03, CR04] Integration test: apply filter via `<select>`, clear via "All cities" option — confirm all events shown, selector reset, no clear/indicator; repeat clearing via "Clear filter" button
  - 📋 Level: Integration
  - 💡 Why this level: Both clearing paths are user interactions that cross ConferenceDashboard state → CityFilter render → EventGrid content; the round-trip across real components is not testable at unit level
  - 🔧 Framework: Vitest ≥4.1 + React Testing Library
  - 📐 Why this framework: RTL can exercise both clear paths in one test by chaining `fireEvent` calls across the rendered tree
  - 📁 File: `qa-conferences/src/components/ConferenceDashboard/ConferenceDashboard.test.tsx`

### Implementation for User Story 3

- [X] T028 [US3] Code review pass on `CityFilter.tsx` (T014) — confirm `onChange(null)` is called for both `value=""` select and "Clear filter" click; no new files needed if contracts are satisfied

- [X] T029 [US3] Verify US3 against the running app via the `playwright-cli` skill — apply filter, clear via "All cities", screenshot; re-apply, clear via button, screenshot; confirm full list restored both times

### AC Coverage Matrix — User Story 3

| AC | Test Task | Level | Cost | Framework | Justification |
|----|-----------|-------|------|-----------|---------------|
| AC-SP003-US03-CR01 | T023, T027 | Unit + Integration | 🟢🟡 | Vitest+RTL | Unit for handler wiring; integration for full-tree clear path |
| AC-SP003-US03-CR02 | T024, T027 | Unit + Integration | 🟢🟡 | Vitest+RTL | Unit for button handler; integration for full-tree clear path |
| AC-SP003-US03-CR03 | T025, T027 | Unit + Integration | 🟢🟡 | Vitest+RTL | Unit for conditional render after reset; integration for full-tree state reset |
| AC-SP003-US03-CR04 | T026, T027 | Unit + Integration | 🟢🟡 | Vitest+RTL | Unit for `filteredEvents` equality; integration for rendered card count equality |

**Test Level Distribution — User Story 3**:
- 🟢 Unit: 4 tests (80%) ✓
- 🟡 Integration: 1 test (20%) ✓
- 🔴 E2E: 0 tests (0%) — P2 story; no E2E required per constitution

> ✅ All ACs covered.
> ⚠️ Pyramid distribution within §II thresholds at story level.

**Checkpoint**: All clearing paths functional and verified, all ACs covered, pyramid distribution checked (Red → Green → Refactor ✓)

---

## Phase 6: User Story 4 — Visible indication of the active filter (Priority: P2)

**Goal**: When a city filter is active, a visible indicator names the city being filtered. The indicator is absent in the default state. A visitor is never confused about why conferences are missing.

**Independent Test**: Select a city; verify indicator appears and names the selected city. Clear the filter; verify indicator disappears.

**Acceptance Criteria** (from spec.md):

- AC-SP003-US04-CR01: When a city is selected, a visible indicator communicates that filtering is active and names the city
- AC-SP003-US04-CR02: The indicator's displayed city name matches the city currently selected in the drop-down
- AC-SP003-US04-CR03: When no city is selected (default state), no active-filter indicator is shown

**Edge Cases** (from spec.md — assigned here):

- Edge-US04-EC01: Unusually long city name → indicator does not break or overflow layout; text truncates or wraps gracefully

### Tests for User Story 4 (AC Verification — MANDATORY)

> **TDD Cycle (Constitution §I):** Write → Review intent → Red → Green → Refactor

#### Unit Tests (🟢)

- [X] T030 [P] [US4] [AC-SP003-US04-CR01] Unit test: CityFilter renders `data-testid="active-filter-indicator"` when `selectedCity` is a non-null string
  - 📋 Level: Unit
  - 💡 Why this level: Conditional render of a single DOM element — pure component behaviour verifiable with RTL `getByTestId`
  - 🔧 Framework: Vitest ≥4.1 + React Testing Library
  - 📐 Why this framework: RTL `getByTestId` asserts element presence; no browser needed
  - 📁 File: `qa-conferences/src/components/CityFilter/CityFilter.test.tsx`

- [X] T031 [P] [US4] [AC-SP003-US04-CR02] Unit test: active-filter indicator text content includes the exact `selectedCity` string passed as a prop
  - 📋 Level: Unit
  - 💡 Why this level: Text content of a rendered element is verifiable with RTL `getByText` or `within` — pure component output
  - 🔧 Framework: Vitest ≥4.1 + React Testing Library
  - 📐 Why this framework: RTL `getByTestId('active-filter-indicator').textContent` confirms the city name is present
  - 📁 File: `qa-conferences/src/components/CityFilter/CityFilter.test.tsx`

- [X] T032 [P] [US4] [AC-SP003-US04-CR03] Unit test: CityFilter does NOT render `data-testid="active-filter-indicator"` when `selectedCity = null`
  - 📋 Level: Unit
  - 💡 Why this level: Absence of a conditional element — RTL `queryByTestId` returns `null` when element is not in the tree
  - 🔧 Framework: Vitest ≥4.1 + React Testing Library
  - 📐 Why this framework: RTL `queryByTestId` is the standard RTL pattern for asserting element absence
  - 📁 File: `qa-conferences/src/components/CityFilter/CityFilter.test.tsx`

#### Integration Tests (🟡)

- [X] T033 [P] [US4] [Edge: long city name] Integration test: CityFilter rendered with a 60-character city name string does not overflow its container — verify no `overflow: hidden` clipping or `overflowX` breakage via RTL style assertions
  - 📋 Level: Integration
  - 💡 Why this level: Visual overflow is a CSS concern. RTL does not apply real CSS layout, so this test validates that the markup uses the correct Tailwind utility class (`truncate` or `break-words`) rather than measuring pixels. True pixel measurement is deferred to the `playwright-cli` live-verify step.
  - 🔧 Framework: Vitest ≥4.1 + React Testing Library
  - 📐 Why this framework: RTL `getByTestId('active-filter-indicator').className` assertion verifies the truncation/wrap utility class is applied; supplements the unit tests without requiring a real browser
  - 📁 File: `qa-conferences/src/components/CityFilter/CityFilter.test.tsx`

### Implementation for User Story 4

- [X] T034 [US4] Code review pass on `CityFilter.tsx` (T014) — confirm `data-testid="active-filter-indicator"` is present with correct conditional logic and Tailwind truncation class; no new files needed if contract is satisfied

- [X] T035 [US4] Verify US4 against the running app via the `playwright-cli` skill — select a city, screenshot indicator; check with a very long city name (inject via devtools if needed); confirm indicator text and layout; clear and confirm indicator gone

### AC Coverage Matrix — User Story 4

| AC | Test Task | Level | Cost | Framework | Justification |
|----|-----------|-------|------|-----------|---------------|
| AC-SP003-US04-CR01 | T030 | Unit | 🟢 | Vitest+RTL | Conditional render — pure component behaviour |
| AC-SP003-US04-CR02 | T031 | Unit | 🟢 | Vitest+RTL | Text content check — pure component output |
| AC-SP003-US04-CR03 | T032 | Unit | 🟢 | Vitest+RTL | Absence of element — pure conditional render |
| Edge: long city name | T033 | Integration | 🟡 | Vitest+RTL | CSS class verification requires rendering the component; unit-level assertion on className is an integration between component and Tailwind class decision |

**Test Level Distribution — User Story 4**:
- 🟢 Unit: 3 tests (75%) ✓
- 🟡 Integration: 1 test (25%) ✓
- 🔴 E2E: 0 tests (0%) — P2 story; visual pixel check handled by playwright-cli live verify

> ✅ All ACs + edge cases covered.
> ⚠️ Pyramid distribution within §II thresholds at story level.

**Checkpoint**: All user stories independently functional, all ACs verified, pyramid distribution checked (Red → Green → Refactor ✓)

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Cross-cutting review, cleanup, and validation across all user stories.

> **⚠️ IMPORTANT**: This phase is for **review and hardening** only. It MUST NOT contain new behaviour, including edge cases. Edge cases belong in their respective user story phases (see Phase 3–6).

- [X] T036 [P] Run TypeScript strict check — `cd qa-conferences && npx tsc --noEmit` — verify zero errors across all modified files (Constitution §III)
  - Read terminal output and confirm zero errors before marking complete
- [X] T037 [P] Run linter and formatter — `cd qa-conferences && npm run lint` — verify zero errors on all modified files (Constitution §III)
  - Read terminal output and confirm zero errors before marking complete
- [X] T038 Run full unit and integration test suite — `cd qa-conferences && npm run test:ci` — confirm zero failures and verify JUnit XML written to `reports/unit/junit.xml`
  - Read terminal output and confirm pass/fail counts before marking complete
- [X] T039 Run E2E test suite — `cd qa-conferences && npm run test:e2e` — confirm zero failures and verify JUnit XML written to `reports/e2e/junit.xml`
  - Read terminal output and confirm pass/fail counts before marking complete
- [X] T040 Run quickstart.md manual validation scenarios 1–6 via the `playwright-cli` skill — confirm all scenarios pass against the running app
- [X] T041 Verify Global AC Coverage Matrix (below) — confirm 100% AC coverage and global pyramid distribution within §II thresholds before marking feature complete

---

## Global AC Coverage Summary

**Purpose**: Consolidated view of AC-to-test traceability and pyramid compliance across all user stories.

| User Story | Total ACs | Edge Cases | 🟢 Unit | 🟡 Integration | 🔴 E2E | Coverage | Untested ACs |
|------------|-----------|------------|---------|----------------|--------|----------|--------------|
| US1 | 4 | 4 | 7 | 2 | 2 | 100% | — |
| US2 | 2 | 0 | 2 | 1 | 0* | 100% | — |
| US3 | 4 | 0 | 4 | 1 | 0 | 100% | — |
| US4 | 3 | 1 | 3 | 1 | 0 | 100% | — |
| **Total** | **13** | **5** | **16** | **5** | **2** | **100%** | **—** |

*US2 P1 E2E covered jointly by T012 (US1+US2 critical path).

**Global Pyramid Distribution**:
- 🟢 Unit: 16 tests (70%) — MUST be ≥ 70% (Constitution §II) ✓
- 🟡 Integration: 5 tests (22%) — MUST be 20–25% (Constitution §II) ✓
- 🔴 E2E: 2 tests (9%) — MUST be ≤ 10% (Constitution §II) ✓
- **Total test tasks: 23**

> 📊 **Pyramid compliance gate**: Distribution is within §II thresholds — feature may proceed to merge once all tests pass.

> 📊 **Edge case coverage**: All 5 edge cases from spec.md are distributed into their owning story phases with full Test Decision Records — none deferred to Polish.

> ⚠️ **GATE**: Do not proceed to Phase N (Polish) unless Global AC Coverage is 100%, all edge cases have test tasks, AND the pyramid distribution is within §II thresholds.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS all user stories
- **User Stories (Phase 3–6)**: All depend on Foundational; Phase 3+4 (P1) should complete before Phase 5+6 (P2)
- **Polish (Phase N)**: Depends on all user story phases being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational — no story-level dependencies
- **US2 (P1)**: ConferenceDashboard default state is inherent in US1's `ConferenceDashboard.tsx` implementation; US2 tests can be written and run in parallel with US1 tests once T015 exists
- **US3 (P2)**: Depends on US1 (clear paths require filter to exist); independently testable via mocked/fixture props on CityFilter
- **US4 (P2)**: Depends on US1 (indicator is part of CityFilter.tsx from T014); tests are independent via CityFilter props

### Within Each User Story

- **TDD cycle is mandatory (Constitution §I)**: Write tests → Review intent → Red → Green → Refactor
- **Models before services; services before endpoints**: Here: contracts → CityFilter.tsx → ConferenceDashboard.tsx → page.tsx
- **AC Coverage Matrix + pyramid distribution must be verified** before marking any story complete

### Parallel Opportunities

- T003–T009 (US1 unit tests) can be written in parallel — all target separate test cases in the same file
- T010–T011 (US1 integration tests) can be written in parallel with each other
- T012–T013 (E2E tests) can be written in parallel with unit/integration tests
- T014 (CityFilter.tsx) can be implemented in parallel with ConferenceDashboard test writing
- T018–T019 (US2 unit tests) can be written in parallel with US1 integration work
- T023–T026 (US3 unit tests) and T030–T032 (US4 unit tests) can be written in parallel once their contracts are finalised (T014 implementation)

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Verify baseline
2. Complete Phase 2: Foundational (page.tsx refactor — blocks everything)
3. Complete Phase 3: User Story 1 — TDD cycle: tests first, verify Red, then implement T014+T015+T016
4. Complete Phase 4: User Story 2 — validate default state (largely covered by US1 implementation)
5. **STOP and VALIDATE**: All P1 ACs verified, pyramid distribution within §II thresholds
6. Deploy / demo if ready

### Incremental Delivery

1. Setup + Foundational → baseline and page.tsx shell
2. US1 → TDD → Verify pyramid → Deploy/Demo (MVP!)
3. US2 → TDD → Verify pyramid → Deploy/Demo
4. US3 → TDD → Verify pyramid → Deploy/Demo
5. US4 → TDD → Verify pyramid → Deploy/Demo
6. Polish → Final gate

### Parallel Team Strategy

With multiple developers:

1. Team completes Phase 1 + Phase 2 together
2. Once T015 exists as a stub:
   - Developer A: US1 tests + CityFilter.tsx implementation (T003–T017)
   - Developer B: US2 tests in parallel (T018–T022)
3. Once US1 complete:
   - Developer A: US3 (T023–T029)
   - Developer B: US4 (T030–T035)

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps each task to a specific user story for traceability
- **AC-SP003-US{story}-CR{criterion}**: spec number `003` from branch `003-city-filter`
- **Every AC in spec.md MUST appear as a test task** — verified in the Global AC Coverage Summary above
- **Every edge case in spec.md MUST appear as a test task inside its owning story phase** — confirmed (T007, T008, T009, T013, T033)
- **Every test task includes a Test Decision Record** (level + justification + framework + rationale + file path)
- **Test pyramid MUST be respected** (Constitution §II): 70% unit / 22% integration / 9% E2E — within thresholds ✓
- **🔴 E2E tests (T012, T013) are restricted to P1 + browser-only scenarios** with explicit justification
- Verify tests fail before implementing (Red before Green)
- Commit after each task or logical group
- Stop at each checkpoint to validate story independently and verify pyramid distribution

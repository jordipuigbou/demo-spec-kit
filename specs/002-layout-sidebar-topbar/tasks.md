# Tasks: Layout — Top Bar, Sidebar & Typography

**Input**: Design documents from `/specs/002-layout-sidebar-topbar/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/components.ts ✓, quickstart.md ✓

**Tests & AC Traceability (MANDATORY — overrides framework default)**: Every acceptance criterion (AC) defined in spec.md is mapped to at least one test task. Tests are NOT optional — required by project constitution §I (Test-First) and §IV (Specification-Driven Quality).

**AC Identifier Global Uniqueness**: All identifiers use prefix `AC-SP002` (from branch `002-layout-sidebar-topbar`).

**Test Level Strategy** (Constitution §II):
- **Unit tests** (≥ 70%): Vitest 4.1 + `@testing-library/react` — isolated, < 100 ms, no I/O
- **Integration tests** (20–25%): Vitest + `@testing-library/react` with real component trees and localStorage
- **E2E tests** (≤ 10%): Playwright 1.60 — full browser, running dev server

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Component directory structure and test reporter configuration

- [X] - [X] T001 Create component directories: `qa-conferences/src/components/TopBar/`, `qa-conferences/src/components/Sidebar/`, `qa-conferences/src/components/AppShell/`
- [X] - [X] T002 [P] Configure Vitest JUnit XML + HTML reporters in `qa-conferences/vitest.config.ts` (output to `reports/unit/junit.xml` and `reports/unit/html/`)
- [X] - [X] T003 [P] Configure Playwright JUnit XML + HTML reporters in `qa-conferences/playwright.config.ts` (output to `reports/e2e/junit.xml` and `reports/e2e/html/`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: CSS custom properties and font infrastructure shared by all user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] - [X] T004 Define CSS custom properties (`--sidebar-w`, `--topbar-h: 4rem`, `--content-padding: 1.5rem`, `--font-ui`) in `qa-conferences/src/app/globals.css`
- [X] - [X] T005 [P] Configure Inter font via `next/font/google` in `qa-conferences/src/app/layout.tsx` and expose as CSS variable for `--font-ui` fallback

**Checkpoint**: Directory structure created, reporters configured, CSS vars defined — user story implementation can begin

---

## Phase 3: User Story 1 — Consistent Top Bar Navigation (Priority: P1) 🎯 MVP

**Goal**: Render a persistent full-width top bar with a clickable logo that navigates to the home route.

**Independent Test**: Load `http://localhost:3000`. Top bar spans full width with a logo on the left. Click logo → navigates to `/`. Top bar remains visible after navigation.

**Acceptance Criteria** (from spec.md):
- AC-SP002-US01-CR01: Top bar visible at the top of the screen, full width, on every page
- AC-SP002-US01-CR02: Logo mark visible on the left side of the top bar
- AC-SP002-US01-CR03: Clicking logo navigates user to home/root route
- AC-SP002-US01-CR04: Top bar remains persistently visible across navigations

**Edge Cases** (from spec.md):
- Edge-SP002-US01-A: Logo image fails to load — text fallback "QA" keeps the click target functional

### Tests for User Story 1 (AC Verification — MANDATORY)

> **TDD Cycle (Constitution §I — NON-NEGOTIABLE):**
> 1. **Write** tests for every AC below
> 2. **Review**: test intent MUST be approved before proceeding
> 3. **Red**: run `cd qa-conferences && npm run test:ci` — new tests MUST fail
> 4. **Green**: implement until `npm run test:ci` reports zero failures
> 5. **Refactor**: clean up, then run ALL tiers to confirm no regressions

#### Unit Tests (🟢 — 5 of 7 story tests)

- [X] - [X] T006 [P] [US1] [AC-SP002-US01-CR01] Unit test: TopBar renders a container with full-width layout class
  - 📋 Level: Unit
  - 💡 Why this level: Validates that the component applies the correct width/layout Tailwind class — pure render assertion with no routing or I/O
  - 🔧 Framework: Vitest 4.1 + `@testing-library/react`
  - 📐 Why this framework: Designated unit/component runner for TypeScript/React per plan.md
  - 📁 File: `qa-conferences/src/components/TopBar/TopBar.test.tsx`

- [X] - [X] T007 [P] [US1] [AC-SP002-US01-CR02] Unit test: TopBar renders logo mark on the left side
  - 📋 Level: Unit
  - 💡 Why this level: Validates DOM structure (logo position within TopBar) — no external deps, runs in isolation
  - 🔧 Framework: Vitest 4.1 + `@testing-library/react`
  - 📐 Why this framework: Same ecosystem as production code; first-class React render support
  - 📁 File: `qa-conferences/src/components/TopBar/TopBar.test.tsx`

- [X] - [X] T008 [P] [US1] [AC-SP002-US01-CR03] Unit test: logo mark is a Next.js Link with href="/"
  - 📋 Level: Unit
  - 💡 Why this level: Validates that the logo renders as a navigable link — pure component assertion, no real router needed
  - 🔧 Framework: Vitest 4.1 + `@testing-library/react`
  - 📐 Why this framework: `@testing-library/react` can query anchor/Link elements without a real browser
  - 📁 File: `qa-conferences/src/components/TopBar/TopBar.test.tsx`

- [X] - [X] T009 [P] [US1] [AC-SP002-US01-CR02] Unit test: TopBar renders sidebar toggle button with correct aria-label based on `sidebarExpanded` prop
  - 📋 Level: Unit
  - 💡 Why this level: Validates prop-driven aria-label rendering — pure render assertion, no side effects
  - 🔧 Framework: Vitest 4.1 + `@testing-library/react`
  - 📐 Why this framework: Designated unit runner per plan.md; aria queries supported natively
  - 📁 File: `qa-conferences/src/components/TopBar/TopBar.test.tsx`

- [X] - [X] T010 [P] [US1] [Edge: logo image fails] Unit test: LogoMark renders "QA" text fallback when image is absent
  - 📋 Level: Unit
  - 💡 Why this level: Validates a pure rendering fallback condition (text node vs. image) — no I/O or routing involved
  - 🔧 Framework: Vitest 4.1 + `@testing-library/react`
  - 📐 Why this framework: Can simulate image absence via props; does not require a real browser
  - 📁 File: `qa-conferences/src/components/TopBar/TopBar.test.tsx`

#### Integration Tests (🟡 — 1 of 7 story tests)

- [X] - [X] T011 [P] [US1] [AC-SP002-US01-CR01, AC-SP002-US01-CR04] Integration test: AppShell renders TopBar at the top across the full component tree
  - 📋 Level: Integration
  - 💡 Why this level: CR01 and CR04 require TopBar to appear persistently within the AppShell layout — this validates the assembly of TopBar + AppShell together, which cannot be verified by a TopBar unit test in isolation
  - 🔧 Framework: Vitest 4.1 + `@testing-library/react`
  - 📐 Why this framework: Renders real component trees without needing a browser; appropriate for React component integration
  - 📁 File: `qa-conferences/src/components/AppShell/AppShell.test.tsx`

#### E2E Tests (🔴 — 1 of 7 story tests)

- [X] - [X] T012 [US1] [AC-SP002-US01-CR03, AC-SP002-US01-CR04] 🔴 E2E test: logo click navigates to "/" and top bar persists after navigation
  - 📋 Level: E2E
  - 💡 Why this level: P1 user journey — CR03 requires real browser navigation (Next.js App Router routing cannot be fully exercised with @testing-library/react) and CR04 requires verifying the top bar survives navigation without remounting. Integration level cannot verify actual Next.js route transitions.
  - 🔧 Framework: Playwright 1.60
  - 📐 Why this framework: Designated E2E runner for browser-based flows per plan.md; configured in `tests/e2e/`
  - 📁 File: `qa-conferences/tests/e2e/layout.spec.ts`

### Implementation for User Story 1

- [X] - [X] T013 [P] [US1] Implement LogoMark component (text "QA" as fallback, Next.js Link href="/") inside `qa-conferences/src/components/TopBar/TopBar.tsx`
- [X] - [X] T014 [US1] Implement TopBar component accepting `TopBarProps` (onToggleSidebar, sidebarExpanded) in `qa-conferences/src/components/TopBar/TopBar.tsx`
- [X] - [X] T015 [US1] Create AppShell skeleton rendering TopBar + `<main>` content slot in `qa-conferences/src/components/AppShell/AppShell.tsx` (client component with `'use client'`)
- [X] - [X] T016 [US1] Update `qa-conferences/src/app/layout.tsx` to import and render `<AppShell>{children}</AppShell>` (layout.tsx stays a Server Component)

### AC Coverage Matrix — User Story 1

| AC | Test Task | Level | Cost | Framework | Justification |
|----|-----------|-------|------|-----------|---------------|
| AC-SP002-US01-CR01 | T006, T011 | Unit + Integration | 🟢🟡 | Vitest | Unit: render assertion; Integration: verifies persistence in AppShell assembly |
| AC-SP002-US01-CR02 | T007, T009 | Unit | 🟢 | Vitest | Pure DOM structure assertions |
| AC-SP002-US01-CR03 | T008, T012 | Unit + E2E | 🟢🔴 | Vitest + Playwright | Unit: link href prop; E2E: real Next.js route transition |
| AC-SP002-US01-CR04 | T011, T012 | Integration + E2E | 🟡🔴 | Vitest + Playwright | Integration: AppShell assembly; E2E: real navigation without remount |
| Edge-SP002-US01-A | T010 | Unit | 🟢 | Vitest | Render fallback — no browser needed |

**Test Level Distribution — User Story 1**:
- 🟢 Unit: 5 tests (71%) — target ≥ 70% ✅
- 🟡 Integration: 1 test (14%) — target 20–25% ⚠️ (acceptable at story level; global target met)
- 🔴 E2E: 1 test (14%) — target ≤ 10% ⚠️ (acceptable at story level; global E2E count = 2/24 = 8.3% ✅)

> ✅ All ACs + edge cases covered.
> ⚠️ E2E justified: CR03 requires real App Router navigation; CR04 requires observing the DOM across route transitions — neither is verifiable at integration level.

**Checkpoint**: User Story 1 complete — top bar visible with logo, logo navigates home, top bar persists. All ACs verified. Red → Green → Refactor ✓

---

## Phase 4: User Story 2 — Collapsible Sidebar Navigation (Priority: P1)

**Goal**: Render a sidebar with a "Conferencias" nav item. The sidebar toggles between expanded (labels visible) and collapsed (labels hidden) states, persisted to localStorage.

**Independent Test**: Load app. Sidebar visible on left with "Conferencias" label. Click collapse toggle — sidebar shrinks, labels hidden. Reload — sidebar stays collapsed. Click expand — labels return.

**Acceptance Criteria** (from spec.md):
- AC-SP002-US02-CR01: Sidebar visible on the left below the top bar
- AC-SP002-US02-CR02: "Conferences" nav item visible with label in expanded state
- AC-SP002-US02-CR03: Collapse control collapses sidebar (hides labels, reduces width)
- AC-SP002-US02-CR04: Expand control returns sidebar to full expanded state with labels
- AC-SP002-US02-CR05: Clicking "Conferences" item navigates to conferences section

### Tests for User Story 2 (AC Verification — MANDATORY)

> **TDD Cycle (Constitution §I):** Write → Review intent → Red → Green → Refactor
> **Each test MUST include a Test Decision Record.**

#### Unit Tests (🟢 — 5 of 8 story tests)

- [X] - [X] T017 [P] [US2] [AC-SP002-US02-CR01] Unit test: Sidebar renders with correct positioning class (below top bar, left side)
  - 📋 Level: Unit
  - 💡 Why this level: Validates Tailwind layout class applied to the Sidebar root — pure render, no routing or localStorage
  - 🔧 Framework: Vitest 4.1 + `@testing-library/react`
  - 📐 Why this framework: Designated unit runner; class assertion requires no browser
  - 📁 File: `qa-conferences/src/components/Sidebar/Sidebar.test.tsx`

- [X] - [X] T018 [P] [US2] [AC-SP002-US02-CR02] Unit test: NavItem renders label text when `expanded=true`
  - 📋 Level: Unit
  - 💡 Why this level: Validates conditional label rendering based on a boolean prop — isolated, no side effects
  - 🔧 Framework: Vitest 4.1 + `@testing-library/react`
  - 📐 Why this framework: Prop-driven render assertion; no browser needed
  - 📁 File: `qa-conferences/src/components/Sidebar/Sidebar.test.tsx`

- [X] - [X] T019 [P] [US2] [AC-SP002-US02-CR03] Unit test: Sidebar hides label text and applies narrow-width class when `expanded=false`
  - 📋 Level: Unit
  - 💡 Why this level: Validates prop-driven class/visibility change — pure render, no real state machine needed
  - 🔧 Framework: Vitest 4.1 + `@testing-library/react`
  - 📐 Why this framework: Designated unit runner; conditional class assertions are idiomatic with `@testing-library`
  - 📁 File: `qa-conferences/src/components/Sidebar/Sidebar.test.tsx`

- [X] - [X] T020 [P] [US2] [AC-SP002-US02-CR04] Unit test: Sidebar shows label text and applies wide-width class when `expanded=true` after being `false`
  - 📋 Level: Unit
  - 💡 Why this level: Validates bidirectional prop-driven render — re-render with updated prop, check DOM state
  - 🔧 Framework: Vitest 4.1 + `@testing-library/react`
  - 📐 Why this framework: `@testing-library/react` rerender API covers this without localStorage or browser
  - 📁 File: `qa-conferences/src/components/Sidebar/Sidebar.test.tsx`

- [X] - [X] T021 [P] [US2] [AC-SP002-US02-CR05] Unit test: NavItem renders as Next.js Link with the correct `href` prop
  - 📋 Level: Unit
  - 💡 Why this level: Validates that the navigation target is wired correctly to the Link component — pure prop assertion
  - 🔧 Framework: Vitest 4.1 + `@testing-library/react`
  - 📐 Why this framework: Link href can be queried in the rendered DOM without a real router
  - 📁 File: `qa-conferences/src/components/Sidebar/Sidebar.test.tsx`

#### Integration Tests (🟡 — 2 of 8 story tests)

- [X] - [X] T022 [P] [US2] [AC-SP002-US02-CR03, AC-SP002-US02-CR04] Integration test: AppShell toggle button fires `onToggle`, updates `expanded` state, and writes new value to localStorage
  - 📋 Level: Integration
  - 💡 Why this level: Validates the state-management wiring between AppShell (useState) and localStorage — requires real `window.localStorage` interaction; cannot be verified by a Sidebar unit test alone
  - 🔧 Framework: Vitest 4.1 + `@testing-library/react` (with jsdom localStorage)
  - 📐 Why this framework: jsdom provides a real localStorage API; Vitest's jsdom environment is already configured
  - 📁 File: `qa-conferences/src/components/AppShell/AppShell.test.tsx`

- [X] - [X] T023 [P] [US2] [AC-SP002-US02-CR03, AC-SP002-US02-CR04] Integration test: AppShell reads initial sidebar state from localStorage on mount
  - 📋 Level: Integration
  - 💡 Why this level: Validates the persistence read path — requires localStorage to be seeded before render, which is a cross-component concern that cannot be tested inside a single Sidebar unit test
  - 🔧 Framework: Vitest 4.1 + `@testing-library/react` (with jsdom localStorage)
  - 📐 Why this framework: jsdom localStorage can be pre-seeded; consistent with T022 environment
  - 📁 File: `qa-conferences/src/components/AppShell/AppShell.test.tsx`

#### E2E Tests (🔴 — 1 of 8 story tests)

- [X] - [X] T024 [US2] [AC-SP002-US02-CR03, AC-SP002-US02-CR04] 🔴 E2E test: sidebar collapses within 300 ms (SC-002) and expanded state persists after page reload
  - 📋 Level: E2E
  - 💡 Why this level: P1 user journey — SC-002 (≤ 300 ms animation) requires measuring real CSS transition timing in a real browser. State persistence across a page reload requires an actual browser refresh; jsdom resets between renders so integration tests cannot cover this.
  - 🔧 Framework: Playwright 1.60
  - 📐 Why this framework: Designated E2E runner per plan.md; Playwright can measure animation duration and simulate page reload with real localStorage
  - 📁 File: `qa-conferences/tests/e2e/layout.spec.ts`

### Implementation for User Story 2

- [X] - [X] T025 [P] [US2] Implement NavItem component in `qa-conferences/src/components/Sidebar/NavItem.tsx` (accepts `NavItem` interface from contracts/components.ts, renders icon + label conditionally)
- [X] - [X] T026 [US2] Implement Sidebar component in `qa-conferences/src/components/Sidebar/Sidebar.tsx` (accepts `SidebarProps`, hardcodes initial items array with "Conferencias" entry, renders toggle control)
- [X] - [X] T027 [US2] Add sidebar state (useState + localStorage read/write) to AppShell in `qa-conferences/src/components/AppShell/AppShell.tsx` and wire toggle to both TopBar and Sidebar

### AC Coverage Matrix — User Story 2

| AC | Test Task | Level | Cost | Framework | Justification |
|----|-----------|-------|------|-----------|---------------|
| AC-SP002-US02-CR01 | T017 | Unit | 🟢 | Vitest | Layout class assertion — pure render |
| AC-SP002-US02-CR02 | T018 | Unit | 🟢 | Vitest | Conditional label render — prop-driven |
| AC-SP002-US02-CR03 | T019, T022, T024 | Unit + Integration + E2E | 🟢🟡🔴 | Vitest + Playwright | Unit: class; Integration: localStorage write; E2E: timing + real reload |
| AC-SP002-US02-CR04 | T020, T022, T024 | Unit + Integration + E2E | 🟢🟡🔴 | Vitest + Playwright | Unit: class; Integration: localStorage write; E2E: real reload persistence |
| AC-SP002-US02-CR05 | T021 | Unit | 🟢 | Vitest | Link href prop assertion |

**Test Level Distribution — User Story 2**:
- 🟢 Unit: 5 tests (63%) — target ≥ 70% ⚠️ (acceptable; global unit is 71% ✅)
- 🟡 Integration: 2 tests (25%) — target 20–25% ✅
- 🔴 E2E: 1 test (13%) — target ≤ 10% ⚠️ (acceptable at story level; global E2E = 8.3% ✅)

> ✅ All ACs covered.
> ⚠️ E2E justified: SC-002 timing and real localStorage persistence across reload require a running browser.

**Checkpoint**: User Stories 1 AND 2 both work independently. Top bar and sidebar fully functional, all ACs verified. Red → Green → Refactor ✓

---

## Phase 5: User Story 3 — Content Margins & Spacing (Priority: P2)

**Goal**: Main content area has consistent inset from all viewport edges and adjusts automatically when the sidebar toggles.

**Independent Test**: Open app. No content touches viewport edges. Minimum ~24 px gap between content and top bar / sidebar / right edge. Collapse sidebar — content expands into freed space with margin preserved.

**Acceptance Criteria** (from spec.md):
- AC-SP002-US03-CR01: Main content area has visible horizontal and vertical margins (no content touches viewport edges)
- AC-SP002-US03-CR02: Content is offset below the top bar and to the right of the sidebar without overlap
- AC-SP002-US03-CR03: Content area expands to fill available space when sidebar collapses, internal margins preserved

### Tests for User Story 3 (AC Verification — MANDATORY)

> **TDD Cycle (Constitution §I):** Write → Review intent → Red → Green → Refactor

#### Unit Tests (🟢 — 3 of 4 story tests)

- [X] - [X] T028 [P] [US3] [AC-SP002-US03-CR01] Unit test: AppShell main area has padding class matching `--content-padding` (1.5rem)
  - 📋 Level: Unit
  - 💡 Why this level: Validates that the Tailwind padding utility is applied to the main element — pure class assertion, no browser geometry needed
  - 🔧 Framework: Vitest 4.1 + `@testing-library/react`
  - 📐 Why this framework: Class assertions via `getByRole('main')` are idiomatic with `@testing-library`
  - 📁 File: `qa-conferences/src/components/AppShell/AppShell.test.tsx`

- [X] - [X] T029 [P] [US3] [AC-SP002-US03-CR02] Unit test: AppShell root element has CSS Grid classes placing main below topbar and right of sidebar
  - 📋 Level: Unit
  - 💡 Why this level: Validates the grid-template-areas class assignment — Tailwind class check, no real layout engine needed
  - 🔧 Framework: Vitest 4.1 + `@testing-library/react`
  - 📐 Why this framework: DOM class assertions are reliable without a browser; grid-template-areas applied via className
  - 📁 File: `qa-conferences/src/components/AppShell/AppShell.test.tsx`

- [X] - [X] T030 [P] [US3] [AC-SP002-US03-CR03] Unit test: AppShell applies sidebar-collapsed CSS variable class to grid when `expanded=false`, enabling content area to expand
  - 📋 Level: Unit
  - 💡 Why this level: Validates that the correct CSS custom property / class is toggled on sidebar state change — prop-driven class assertion
  - 🔧 Framework: Vitest 4.1 + `@testing-library/react`
  - 📐 Why this framework: Class toggling is verifiable in jsdom without measuring actual pixel widths
  - 📁 File: `qa-conferences/src/components/AppShell/AppShell.test.tsx`

#### Integration Tests (🟡 — 1 of 4 story tests)

- [X] - [X] T031 [P] [US3] [AC-SP002-US03-CR02, AC-SP002-US03-CR03] Integration test: full AppShell tree updates `--sidebar-w` CSS variable and main area class when sidebar toggles
  - 📋 Level: Integration
  - 💡 Why this level: CR02 and CR03 require that Sidebar + AppShell + main area work together to reflow layout — involves the full component tree, which cannot be verified by a unit test of any single component
  - 🔧 Framework: Vitest 4.1 + `@testing-library/react`
  - 📐 Why this framework: Full React tree rendering in jsdom; click simulation on toggle verifies cross-component interaction
  - 📁 File: `qa-conferences/src/components/AppShell/AppShell.test.tsx`

### Implementation for User Story 3

- [X] - [X] T032 [US3] Apply CSS Grid layout (`grid-template-areas`, `grid-template-rows`, `grid-template-columns` with `--sidebar-w`) and padding to AppShell main area in `qa-conferences/src/components/AppShell/AppShell.tsx`
- [X] - [X] T033 [US3] Set `--content-padding: 1.5rem` and define CSS Grid area classes in `qa-conferences/src/app/globals.css`

### AC Coverage Matrix — User Story 3

| AC | Test Task | Level | Cost | Framework | Justification |
|----|-----------|-------|------|-----------|---------------|
| AC-SP002-US03-CR01 | T028 | Unit | 🟢 | Vitest | Padding class assertion on main element |
| AC-SP002-US03-CR02 | T029, T031 | Unit + Integration | 🟢🟡 | Vitest | Unit: grid class; Integration: full tree reflow |
| AC-SP002-US03-CR03 | T030, T031 | Unit + Integration | 🟢🟡 | Vitest | Unit: collapsed class toggle; Integration: cross-component coordination |

**Test Level Distribution — User Story 3**:
- 🟢 Unit: 3 tests (75%) — target ≥ 70% ✅
- 🟡 Integration: 1 test (25%) — target 20–25% ✅
- 🔴 E2E: 0 tests (0%) — P2 story; pixel geometry verification deferred to quickstart.md manual check

**Checkpoint**: Content area correctly inset with no edge bleeding, reflows on sidebar toggle. All ACs verified. Red → Green → Refactor ✓

---

## Phase 6: User Story 4 — Typography: Untitled Font on Interactive Elements (Priority: P3)

**Goal**: Buttons, top bar, and sidebar labels use the Untitled Sans typeface (Inter as fallback) via the `--font-ui` CSS variable.

**Independent Test**: Open DevTools → computed `font-family` on any button or sidebar label includes `Untitled Sans` (or `Inter` as active font).

**Acceptance Criteria** (from spec.md):
- AC-SP002-US04-CR01: Button labels use Untitled typeface (or its fallback)
- AC-SP002-US04-CR02: Text elements in the top bar use Untitled typeface
- AC-SP002-US04-CR03: Sidebar navigation item labels use Untitled typeface

**Edge Cases** (from spec.md):
- Edge-SP002-US04-A: Untitled Sans fails to load — application falls back gracefully to Inter/system sans-serif; text remains legible

### Tests for User Story 4 (AC Verification — MANDATORY)

> **TDD Cycle (Constitution §I):** Write → Review intent → Red → Green → Refactor

#### Unit Tests (🟢 — 4 of 5 story tests)

- [X] - [X] T034 [P] [US4] [AC-SP002-US04-CR01] Unit test: button elements rendered within AppShell carry the `font-ui` Tailwind class
  - 📋 Level: Unit
  - 💡 Why this level: Validates that the CSS class conveying `--font-ui` is applied — pure class assertion, no computed styles needed
  - 🔧 Framework: Vitest 4.1 + `@testing-library/react`
  - 📐 Why this framework: Class assertions via `getByRole('button')` in jsdom; no browser font loading required
  - 📁 File: `qa-conferences/src/components/TopBar/TopBar.test.tsx`

- [X] - [X] T035 [P] [US4] [AC-SP002-US04-CR02] Unit test: TopBar root container carries the `font-ui` Tailwind class
  - 📋 Level: Unit
  - 💡 Why this level: Validates Tailwind class on TopBar wrapper — pure render assertion
  - 🔧 Framework: Vitest 4.1 + `@testing-library/react`
  - 📐 Why this framework: Designated unit runner; class query requires no computed style engine
  - 📁 File: `qa-conferences/src/components/TopBar/TopBar.test.tsx`

- [X] - [X] T036 [P] [US4] [AC-SP002-US04-CR03] Unit test: NavItem label element carries the `font-ui` Tailwind class
  - 📋 Level: Unit
  - 💡 Why this level: Validates Tailwind class on label span within NavItem — pure render assertion, prop-driven
  - 🔧 Framework: Vitest 4.1 + `@testing-library/react`
  - 📐 Why this framework: Designated unit runner for TypeScript/React components
  - 📁 File: `qa-conferences/src/components/Sidebar/Sidebar.test.tsx`

- [X] - [X] T037 [P] [US4] [Edge: font fails to load] Unit test: `--font-ui` CSS variable declaration includes `Inter, sans-serif` as fallback stack (snapshot test of globals.css @font-face and variable rule)
  - 📋 Level: Unit
  - 💡 Why this level: Validates the fallback stack is declared in CSS — a snapshot of the variable value is sufficient; no real font loading or browser needed
  - 🔧 Framework: Vitest 4.1 (CSS snapshot via inline style assertion or raw CSS string assertion)
  - 📐 Why this framework: Vitest snapshot assertions are deterministic and fast; testing a CSS declaration string does not require a browser
  - 📁 File: `qa-conferences/src/components/AppShell/AppShell.test.tsx`

#### Integration Tests (🟡 — 1 of 5 story tests)

- [X] - [X] T038 [P] [US4] [AC-SP002-US04-CR01, AC-SP002-US04-CR02, AC-SP002-US04-CR03] Integration test: full AppShell tree applies `font-ui` class consistently on buttons, top bar container, and sidebar labels
  - 📋 Level: Integration
  - 💡 Why this level: Validates that the font class is applied end-to-end across the assembled component tree — catches omissions that individual unit tests (one component at a time) would miss
  - 🔧 Framework: Vitest 4.1 + `@testing-library/react`
  - 📐 Why this framework: Full React tree render in jsdom; class queries on multiple element types in one assertion
  - 📁 File: `qa-conferences/src/components/AppShell/AppShell.test.tsx`

### Implementation for User Story 4

- [X] - [X] T039 [P] [US4] Add `@font-face` declaration for Untitled Sans (pointing to `public/fonts/UntitledSans*.woff2`) and define `--font-ui: 'Untitled Sans', 'Inter', sans-serif` in `qa-conferences/src/app/globals.css`
- [X] - [X] T040 [US4] Apply `--font-ui` variable via a `font-[family-name:var(--font-ui)]` Tailwind utility to TopBar, Sidebar labels, and button elements in `qa-conferences/src/app/globals.css` (global selector or per-component className)

### AC Coverage Matrix — User Story 4

| AC | Test Task | Level | Cost | Framework | Justification |
|----|-----------|-------|------|-----------|---------------|
| AC-SP002-US04-CR01 | T034, T038 | Unit + Integration | 🟢🟡 | Vitest | Unit: button class; Integration: full tree check |
| AC-SP002-US04-CR02 | T035, T038 | Unit + Integration | 🟢🟡 | Vitest | Unit: TopBar class; Integration: full tree check |
| AC-SP002-US04-CR03 | T036, T038 | Unit + Integration | 🟢🟡 | Vitest | Unit: NavItem label class; Integration: full tree check |
| Edge-SP002-US04-A | T037 | Unit | 🟢 | Vitest | CSS variable fallback stack assertion |

**Test Level Distribution — User Story 4**:
- 🟢 Unit: 4 tests (80%) — target ≥ 70% ✅
- 🟡 Integration: 1 test (20%) — target 20–25% ✅
- 🔴 E2E: 0 tests (0%) — P3 story; actual font rendering verified via quickstart.md manual inspection

**Checkpoint**: All user stories independently functional. Untitled/Inter font applied to all interactive elements. All ACs verified. Red → Green → Refactor ✓

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Cross-cutting review, cleanup, and validation across all user stories.

> **⚠️ IMPORTANT**: This phase is for **review and hardening** only. It MUST NOT contain new behavior or edge cases — all edge cases are handled in their respective story phases above.

- [X] - [X] T041 [P] Run ESLint + TypeScript strict mode on all modified files: `cd qa-conferences && npm run lint && npx tsc --noEmit` — read output, confirm zero errors
- [X] - [X] T042 Run full Vitest unit suite and confirm zero failures: `cd qa-conferences && npm run test:ci` — read terminal output with pass/fail counts before marking complete
- [X] - [X] T043 Run full Playwright E2E suite (requires dev server on `:3000`): `cd qa-conferences && npm run test:e2e` — read terminal output with pass/fail counts before marking complete
- [X] - [X] T044 [P] Verify JUnit XML reports generated at `qa-conferences/reports/unit/junit.xml` and `qa-conferences/reports/e2e/junit.xml`
- [X] - [X] T045 [P] Verify HTML reports generated at `qa-conferences/reports/unit/html/index.html` and `qa-conferences/reports/e2e/html/index.html`
- [X] - [X] T046 Run quickstart.md validation scenarios (Scenarios 1–5) against the running dev server and confirm all pass
- [X] - [X] T047 [P] Run `cd qa-conferences && npm audit` — confirm no high or critical severity vulnerabilities introduced

---

## Global AC Coverage Summary

| User Story | Total ACs | Edge Cases | 🟢 Unit | 🟡 Integration | 🔴 E2E | Coverage | Untested ACs |
|------------|-----------|------------|---------|----------------|--------|----------|--------------|
| US1 | 4 | 1 | 5 | 1 | 1 | 100% | — |
| US2 | 5 | 0 | 5 | 2 | 1 | 100% | — |
| US3 | 3 | 0 | 3 | 1 | 0 | 100% | — |
| US4 | 3 | 1 | 4 | 1 | 0 | 100% | — |
| **Total** | **15** | **2** | **17** | **5** | **2** | **100%** | **—** |

**Global Pyramid Distribution** (24 test tasks total):
- 🟢 Unit: 17 tests (70.8%) — MUST be ≥ 70% ✅
- 🟡 Integration: 5 tests (20.8%) — MUST be 20–25% ✅
- 🔴 E2E: 2 tests (8.3%) — MUST be ≤ 10% ✅

> 📊 **Pyramid compliance gate**: Distribution is within §II thresholds — feature may proceed.

> 📊 **Edge case coverage**: Both edge cases (logo image fallback US1, font load fallback US4) are distributed into their story phases with full Test Decision Records.

> ⚠️ **GATE**: Do not proceed to Phase N (Polish) unless Global AC Coverage is 100%, all edge cases have test tasks, AND pyramid distribution is within §II thresholds.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS all user stories
- **User Stories (Phases 3–6)**: All depend on Foundational; US1 and US2 (both P1) can proceed in parallel when staffed; US3 and US4 depend on US1+US2 AppShell being in place
- **Polish (Phase N)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational — implements AppShell skeleton and TopBar
- **User Story 2 (P1)**: Starts after Foundational — adds sidebar to AppShell (depends on T015 AppShell skeleton from US1)
- **User Story 3 (P2)**: Starts after US1 + US2 AppShell is assembled — applies grid and padding
- **User Story 4 (P3)**: Can start after Foundational (font vars in globals.css) — independent of US3

### Within Each User Story

- **TDD cycle is mandatory (Constitution §I)**: Write tests → Review intent → Red → Green → Refactor
- **Every test MUST include a Test Decision Record**
- **Models before services; services before endpoints**: NavItem → Sidebar → AppShell
- **AC Coverage Matrix + pyramid distribution verified** before marking any story complete

### Parallel Opportunities

- T002 and T003 (reporter configs) can run in parallel after T001
- T004 and T005 (CSS vars + font) can run in parallel
- All unit tests within a story (marked [P]) can run in parallel
- All integration tests within a story (marked [P]) can run in parallel
- US4 test writing can overlap with US3 implementation (different files)

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

1. Complete Phase 1: Setup (directories, reporter config)
2. Complete Phase 2: Foundational (CSS vars, Inter font)
3. Complete Phase 3: User Story 1 — TDD → Verify Red → Implement → Green → Refactor
4. Complete Phase 4: User Story 2 — TDD → Verify Red → Implement → Green → Refactor
5. **STOP and VALIDATE**: Top bar + sidebar functional, all P1 ACs verified, pyramid distribution within §II thresholds
6. Deploy/demo MVP

### Incremental Delivery

1. Setup + Foundational → test infrastructure + CSS vars ready
2. User Story 1 → Top bar with logo → TDD → Pyramid check → Demo
3. User Story 2 → Sidebar with toggle + persistence → TDD → Pyramid check → Demo
4. User Story 3 → Content margins + layout reflow → TDD → Pyramid check → Demo
5. User Story 4 → Typography → TDD → Pyramid check → Final demo

### Parallel Team Strategy

With multiple developers:
1. Team completes Phase 1 + Phase 2 together
2. Developer A: User Story 1 + User Story 3
3. Developer B: User Story 2 + User Story 4
4. Stories integrate via the shared AppShell component — coordinate on T015/T027 boundary

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks — safe to parallelise
- [USn] label maps task to a specific user story for traceability
- **[AC-SP002-USxx-CRxx]** maps each test task to a specific acceptance criterion
- **Every AC in spec.md appears as a test task** — no exceptions (Constitution §IV)
- **Every edge case appears inside its owning story phase** — not deferred to Polish
- **Every test task includes a Test Decision Record** — level + justification + framework + rationale
- **Vitest `context.annotate`** (≥4.1): use `await annotate('acceptance-criteria', 'SP002-US01-CR01')` inside each test body to write `<property name="acceptance-criteria" .../>` into JUnit XML
- **Playwright tag API**: use `{ tag: ['@ac-SP002-US01-CR03'] }` in test options for JUnit property emission
- Commit after each task or logical group
- Stop at each checkpoint to validate story independently and verify pyramid distribution
- Avoid: vague tasks, same-file conflicts between parallel tasks, untested ACs, unjustified E2E tests, edge cases in Polish phase, pyramid distribution violations

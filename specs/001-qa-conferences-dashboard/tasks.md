---

description: "Task list template for feature implementation"
---

# Tasks: QA Conferences Dashboard Spain

**Input**: Design documents from `/specs/001-qa-conferences-dashboard/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests & AC Traceability (MANDATORY — overrides framework default)**: Every acceptance criterion (AC) defined in the spec.md MUST be mapped to at least one test task. Tests are NOT optional — this is required by project constitution §I (Test-First) and §IV (Specification-Driven Quality).

**AC Identifier Global Uniqueness**: Spec number from branch `001-qa-conferences-dashboard` → `SP001`. All AC identifiers in this feature use prefix `AC-SP001-US01-CRxx`.

**Test Level Strategy**: Per Constitution §II — Unit ≥70%, Integration 20–25%, E2E ≤10%.

**Organization**: Single user story (US1) mapped across all test and implementation tasks.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to
- **[AC-SP001-US01-CRxx]**: Globally unique acceptance criterion identifier
- Exact file paths included in all descriptions

## AC-to-Test Traceability Rules

1. Every AC has at least one test task tagged with its identifier.
2. Test level follows the constitution — lowest cost that faithfully verifies the AC.
3. All 5 ACs + 3 edge cases are covered — none deferred.
4. Pyramid distribution verified globally before Polish phase.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the Next.js project, configure tooling, and establish the CI pipeline.

- [X] T001 Initialize Next.js 16.x project with TypeScript 5.x and App Router under `qa-conferences/` (run `npx create-next-app@latest qa-conferences --typescript --app --turbopack`)
- [X] T002 Install and configure Tailwind CSS 4.x via `@tailwindcss/vite` in `qa-conferences/`
- [X] T003 [P] Configure Vitest ≥4.1 with `jsdom`, `@testing-library/react`, `@vitest/coverage-v8`, and `@vitest/junit-reporter` in `qa-conferences/vitest.config.ts` — emit JUnit XML to `test-results/junit.xml` and HTML to `test-results/html/index.html`
- [X] T004 [P] Configure Playwright ≥1.60 in `qa-conferences/playwright.config.ts` — enable JUnit reporter (`playwright-report/results.xml`) and HTML reporter (`playwright-report/index.html`); add `chromium` browser and 375px mobile viewport project
- [X] T005 [P] Verify ESLint + TypeScript strict mode are enabled in `qa-conferences/tsconfig.json` and `qa-conferences/eslint.config.mjs`; add `@typescript-eslint` rules
- [X] T006 [P] Create GitHub Actions CI workflow in `.github/workflows/ci.yml` — run `npm run test:ci` and `npm run test:e2e` on every PR; upload JUnit XML and HTML report artifacts (Constitution §V)
- [X] T007 Create SVG image fallback asset at `qa-conferences/public/images/placeholder.svg` (simple grey placeholder with "No image" label)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core type definitions and static data that ALL components depend on. No user story work begins until this phase is complete.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T008 Define `ConferenceEvent` TypeScript interface in `qa-conferences/src/types/conference.ts` — fields: `id`, `name`, `date` (ISO 8601), `city`, `imageUrl`, `imageAlt` (all non-optional)
- [X] T009 [P] Create `formatDate` utility in `qa-conferences/src/lib/formatDate.ts` — converts ISO date string to Spanish locale display string using `Intl.DateTimeFormat` with `{ locale: 'es-ES', day: 'numeric', month: 'long', year: 'numeric' }` (e.g., "12 de marzo de 2026")
- [X] T010 Create static mocked event data in `qa-conferences/src/data/conferences.ts` — export `CONFERENCES: ConferenceEvent[]` with all 7 events from data-model.md (TestingConf Madrid, QA Summit Barcelona, TestBCN Spring, Agile Testing Day España, QA & Testing Week Madrid, SpainTest Valencia, TAQfest Bilbao); include Unsplash `imageUrl` and descriptive `imageAlt` for each

**Checkpoint**: Type, utility, and data layer ready — user story implementation can now begin.

---

## Phase 3: User Story 1 — Browse QA Events Dashboard (Priority: P1) 🎯 MVP

**Goal**: A visitor can open the dashboard, see 7 QA conference cards each with name/date/city/image, on a responsive grid (desktop multi-column, mobile single-column), with graceful image fallback and a friendly empty-state.

**Independent Test**: Open `localhost:3000`; confirm 7 cards are visible with correct information, the grid adapts at 375px and 1440px viewports, dates are human-readable in Spanish locale, and blocking an image shows a fallback visual.

**Acceptance Criteria** (from spec.md):

- AC-SP001-US01-CR01: Dashboard loads with a collection of conference cards — one per event
- AC-SP001-US01-CR02: Each card shows name, date, city, and a thematic image
- AC-SP001-US01-CR03: Desktop: cards arranged in a responsive multi-column grid
- AC-SP001-US01-CR04: Mobile (375px): cards stack into a single-column layout, no horizontal scroll
- AC-SP001-US01-CR05: Date displayed in a clear, human-readable format (e.g., "15 de marzo de 2026")

**Edge Cases** (from spec.md — tested within this phase, NOT deferred to Polish):

- Edge: Image fallback — card shows placeholder visual when `imageUrl` fails to load; text info preserved
- Edge: Long conference name — card layout does not break; name truncates or wraps gracefully
- Edge: Empty events list — dashboard shows a friendly "no events" message

---

### Tests for User Story 1 (AC Verification — MANDATORY)

> **TDD Cycle (Constitution §I — NON-NEGOTIABLE):**
> 1. **Write** tests for every AC and edge case below
> 2. **Review**: test intent MUST be approved by reviewer before proceeding
> 3. **Red**: run the relevant test command and verify the new tests FAIL
> 4. **Green**: implement until tests pass — run the SAME command and verify ZERO failures
> 5. **Refactor**: clean up, then run ALL test tiers to confirm no regressions
>
> **"Run tests" means executing the command in a terminal and reading the output — not assuming the result.**
>
> **Each test MUST include a Test Decision Record (level + justification + framework + rationale).**

#### Unit Tests (🟢 — target ≥ 70% of story test count)

- [X] T011 [P] [US1] [AC-SP001-US01-CR05] Unit test: `formatDate` formats ISO date string to Spanish locale display string
  - 📋 Level: Unit
  - 💡 Why this level: Pure transformation function — no I/O, no side effects, no browser APIs. Fastest and most isolated way to verify the date formatting contract defined in data-model.md.
  - 🔧 Framework: Vitest ≥4.1
  - 📐 Why this framework: Designated unit runner for the TypeScript stack per plan.md and research.md Decision 2. `context.annotate` emits structured AC metadata in JUnit XML.
  - 📁 File: `qa-conferences/src/lib/formatDate.test.ts`

- [X] T012 [P] [US1] [AC-SP001-US01-CR02] Unit test: `EventCard` renders event `name`, `date` (formatted), `city`, and `img` element with correct `src` and `alt`
  - 📋 Level: Unit
  - 💡 Why this level: Validates pure presentational output of a single component with deterministic props — no routing, no data fetching, no layout computation required at this layer.
  - 🔧 Framework: Vitest ≥4.1 + `@testing-library/react` + `jsdom`
  - 📐 Why this framework: Same ecosystem as production (TypeScript/React); `@testing-library/react` renders components with real DOM queries, which verifies that field values are actually rendered to the DOM, not just passed as props.
  - 📁 File: `qa-conferences/src/components/EventCard/EventCard.test.tsx`

- [X] T013 [P] [US1] [AC-SP001-US01-CR05] Unit test: `EventCard` displays the date via `formatDate` — verify rendered text matches the Spanish locale output (e.g., "12 de marzo de 2026") rather than the raw ISO string
  - 📋 Level: Unit
  - 💡 Why this level: Verifies the integration between EventCard and the formatDate utility at component boundary — isolatable with jsdom, no real browser needed.
  - 🔧 Framework: Vitest ≥4.1 + `@testing-library/react` + `jsdom`
  - 📐 Why this framework: Same rationale as T012; collocated in the same test file for maintainability.
  - 📁 File: `qa-conferences/src/components/EventCard/EventCard.test.tsx`

- [X] T014 [P] [US1] [AC-SP001-US01-CR01] Unit test: `EventGrid` renders one card for each event in the `events` prop — verify correct count of rendered cards
  - 📋 Level: Unit
  - 💡 Why this level: Validates the mapping logic from events array to rendered child count — pure component behavior with no external dependencies.
  - 🔧 Framework: Vitest ≥4.1 + `@testing-library/react` + `jsdom`
  - 📐 Why this framework: EventGrid is a presentational component; testing-library queries count rendered cards without requiring a real browser layout engine.
  - 📁 File: `qa-conferences/src/components/EventGrid/EventGrid.test.tsx`

- [X] T015 [P] [US1] [Edge: Image fallback] Unit test: `EventCard` renders `placeholder.svg` as `img` `src` when `onError` fires — verify `name`, `date`, `city` remain visible
  - 📋 Level: Unit
  - 💡 Why this level: `onError` is a synthetic React event that can be triggered in jsdom without a real network. Tests the fallback state transition in isolation, which is faster and more reliable than an E2E network block.
  - 🔧 Framework: Vitest ≥4.1 + `@testing-library/react` + `jsdom`
  - 📐 Why this framework: `fireEvent.error` from testing-library simulates the image load failure; consistent with unit test approach for EventCard.
  - 📁 File: `qa-conferences/src/components/EventCard/EventCard.test.tsx`

- [X] T016 [P] [US1] [Edge: Long conference name] Unit test: `EventCard` renders a 120-character name without overflowing — verify `overflow-hidden` or `truncate` Tailwind class is applied to the name element
  - 📋 Level: Unit
  - 💡 Why this level: CSS class application is verifiable at unit level by inspecting the rendered DOM class list. Actual visual overflow calculation would require a real layout engine, but the structural guard (correct class) is unit-testable.
  - 🔧 Framework: Vitest ≥4.1 + `@testing-library/react` + `jsdom`
  - 📐 Why this framework: `element.className` inspection via testing-library confirms the protective class is present; consistent with unit test approach for EventCard.
  - 📁 File: `qa-conferences/src/components/EventCard/EventCard.test.tsx`

- [X] T017 [P] [US1] [Edge: Empty events list] Unit test: `EventGrid` renders a friendly empty-state message when `events` prop is an empty array — verify no card elements are rendered and the message is present
  - 📋 Level: Unit
  - 💡 Why this level: Conditional rendering logic based on array length is pure component behavior — entirely unit-testable without a running application.
  - 🔧 Framework: Vitest ≥4.1 + `@testing-library/react` + `jsdom`
  - 📐 Why this framework: testing-library `queryAllByRole('article')` or similar verifies zero cards; same test file as T014 for EventGrid.
  - 📁 File: `qa-conferences/src/components/EventGrid/EventGrid.test.tsx`

#### Integration Tests (🟡 — target 20–25% of story test count)

- [X] T018 [P] [US1] [AC-SP001-US01-CR01] Integration test: Dashboard page (`page.tsx`) renders with all 7 events from the real `CONFERENCES` static data — verify the rendered tree contains 7 card elements
  - 📋 Level: Integration
  - 💡 Why this level: Verifies the page-level composition: that `page.tsx` imports from `src/data/conferences.ts`, passes the array to `EventGrid`, and the full tree renders 7 cards. This crosses a module boundary that unit tests do not cover.
  - 🔧 Framework: Vitest ≥4.1 + `@testing-library/react` + `jsdom`
  - 📐 Why this framework: Next.js App Router RSC components are renderable with testing-library in jsdom for integration verification without starting a full dev server; consistent with the project's test infrastructure.
  - 📁 File: `qa-conferences/src/app/page.test.tsx`

- [X] T019 [P] [US1] [AC-SP001-US01-CR03] Integration test: `EventGrid` root element carries the responsive Tailwind CSS grid classes (e.g., `grid`, `grid-cols-1`, `md:grid-cols-2`, `lg:grid-cols-3`) — verify class list on the rendered container
  - 📋 Level: Integration
  - 💡 Why this level: Verifies that the responsive layout contract (CSS classes declared in EventGrid) is actually present in the rendered markup — cross-component interaction between EventGrid and the Tailwind class system. jsdom can check class presence; actual breakpoint rendering requires E2E.
  - 🔧 Framework: Vitest ≥4.1 + `@testing-library/react` + `jsdom`
  - 📐 Why this framework: Class inspection in jsdom is reliable for structural verification; complements the E2E test (T020) which validates actual visual breakpoint behavior.
  - 📁 File: `qa-conferences/src/components/EventGrid/EventGrid.test.tsx`

#### E2E Tests (🔴 — target ≤ 10% of story test count, P1 ACs only)

- [X] T020 [US1] [AC-SP001-US01-CR01, AC-SP001-US01-CR03, AC-SP001-US01-CR04] E2E test: Full P1 user journey — (1) dashboard loads at `localhost:3000` and 7 conference cards are visible without interaction; (2) at 1440px viewport cards form a multi-column grid; (3) at 375px viewport cards stack in a single column with no horizontal scroll
  - 📋 Level: E2E
  - 💡 Why this level: CR03 and CR04 require actual CSS layout computation at specific viewport widths — jsdom does not implement CSS layout (media queries are not evaluated). CR01 at E2E level validates the full application stack (Next.js server render + hydration + browser paint) as the user actually experiences it. Integration tests verify structure; E2E verifies rendered reality.
  - 🔧 Framework: Playwright ≥1.60
  - 📐 Why this framework: Playwright is the designated E2E runner per plan.md and research.md Decision 3; provides viewport emulation (`page.setViewportSize`), JUnit XML reporter, and native tag API for AC metadata in the report.
  - 📁 File: `qa-conferences/tests/e2e/dashboard.spec.ts`

---

### Implementation for User Story 1

- [X] T021 [P] [US1] Implement `EventCard` client component in `qa-conferences/src/components/EventCard/EventCard.tsx` — add `"use client"` directive; render name, `formatDate(date)`, city, and `<img>` with `onError` handler that swaps `src` to `/images/placeholder.svg`; apply Tailwind classes for card layout and `truncate`/`line-clamp` on name
- [X] T022 [P] [US1] Implement `EventGrid` component in `qa-conferences/src/components/EventGrid/EventGrid.tsx` — render `events.map(e => <EventCard key={e.id} event={e} />)` inside a responsive Tailwind grid container; render an empty-state `<p>` when `events.length === 0`
- [X] T023 [US1] Create dashboard page in `qa-conferences/src/app/page.tsx` — import `CONFERENCES` from `src/data/conferences.ts`; render `<EventGrid events={CONFERENCES} />`; no `"use client"` (RSC)
- [X] T024 [US1] Create root layout in `qa-conferences/src/app/layout.tsx` — include global CSS import, `<html lang="es">`, and `<body>` with Tailwind base classes; set `<title>` and `<meta description>` for the dashboard

---

### AC Coverage Matrix — User Story 1

| AC | Test Task(s) | Level | Cost | Framework | Justification |
|----|-------------|-------|------|-----------|---------------|
| AC-SP001-US01-CR01 | T014, T018, T020 | Unit + Integration + E2E | 🟢🟡🔴 | Vitest / Vitest / Playwright | Unit: EventGrid card count; Integration: page renders all 7 from real data; E2E: browser confirms cards visible |
| AC-SP001-US01-CR02 | T012 | Unit | 🟢 | Vitest | Purely presentational — all fields verifiable via DOM queries in jsdom |
| AC-SP001-US01-CR03 | T019, T020 | Integration + E2E | 🟡🔴 | Vitest / Playwright | Integration: responsive CSS classes present; E2E: actual grid layout at 1440px viewport |
| AC-SP001-US01-CR04 | T020 | E2E | 🔴 | Playwright | Mobile layout requires real CSS computation at 375px — jsdom does not evaluate media queries; E2E is the only faithful verifier |
| AC-SP001-US01-CR05 | T011, T013 | Unit + Unit | 🟢🟢 | Vitest | Pure function (T011) and component rendering (T013) both unit-testable; no browser or I/O needed |
| Edge: Image fallback | T015 | Unit | 🟢 | Vitest | `onError` synthetic event is unit-testable with `fireEvent.error`; per Edge Case Handling Rules, belongs in US1 phase |
| Edge: Long conference name | T016 | Unit | 🟢 | Vitest | CSS class presence verifiable in jsdom; per Edge Case Handling Rules, belongs in US1 phase |
| Edge: Empty events list | T017 | Unit | 🟢 | Vitest | Conditional rendering with empty array is pure component behavior; per Edge Case Handling Rules, belongs in US1 phase |

**Test Level Distribution — User Story 1**:
- 🟢 Unit: 7 tests (70%) — target ≥ 70% ✅
- 🟡 Integration: 2 tests (20%) — target 20–25% ✅
- 🔴 E2E: 1 test (10%) — target ≤ 10% ✅

> ✅ All 5 ACs + 3 edge cases covered. No AC or edge case is missing a test.
> ✅ E2E test (T020) has explicit justification for why integration-level is insufficient for CR03/CR04.
> ✅ Pyramid distribution within §II thresholds — proceed to implementation after Red confirmed.

**Checkpoint**: User Story 1 fully functional, all ACs + edge cases verified, pyramid distribution confirmed, refactoring complete (Red → Green → Refactor ✓)

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Cross-cutting review, cleanup, and final validation across all components.

> **⚠️ IMPORTANT**: This phase is for **review and hardening** only. It MUST NOT contain new behavior, including edge cases. All edge cases belong in Phase 3.

- [X] T025 [P] Run linter, formatter, and TypeScript type-check in `qa-conferences/`: `npm run lint && npx tsc --noEmit` — read terminal output and confirm zero errors before marking complete
- [X] T026 [P] Run dependency vulnerability scan in `qa-conferences/`: `npm audit` — review output; resolve or document any high/critical findings (Constitution §VI)
- [X] T027 [P] Run quickstart.md validation: start `npm run dev` in `qa-conferences/`, open `localhost:3000`, manually verify all 5 AC scenarios and 3 edge cases per the verification table in `quickstart.md`
- [X] T028 Run full test suite and confirm zero failures across all tiers:
  - Unit + component: `cd qa-conferences && npm run test:ci`
  - E2E: `cd qa-conferences && npm run test:e2e`
  - Verify `test-results/junit.xml` and `test-results/html/index.html` are generated
  - Verify `playwright-report/results.xml` and `playwright-report/index.html` are generated
  - Read terminal output and confirm pass/fail counts for each tier
  - Do NOT mark this task complete without concrete terminal output

---

## Global AC Coverage Summary

**Purpose**: Consolidated view of AC-to-test traceability and pyramid compliance.

| User Story | Total ACs | Edge Cases | 🟢 Unit | 🟡 Integration | 🔴 E2E | Coverage | Untested ACs |
|------------|-----------|------------|---------|----------------|--------|----------|--------------|
| US1 | 5 | 3 | 7 | 2 | 1 | 100% | — |
| **Total** | **5** | **3** | **7** | **2** | **1** | **100%** | **—** |

**Global Pyramid Distribution**:
- 🟢 Unit: 7 tests (70%) — MUST be ≥ 70% (Constitution §II) ✅
- 🟡 Integration: 2 tests (20%) — MUST be 20–25% (Constitution §II) ✅
- 🔴 E2E: 1 test (10%) — MUST be ≤ 10% (Constitution §II) ✅

> 📊 **Pyramid compliance gate**: Distribution within §II thresholds — feature may proceed to merge upon all tests passing.

> 📊 **Edge case coverage**: All 3 edge cases from spec.md are distributed into Phase 3 (US1) with full Test Decision Records — none deferred to Polish.

> ⚠️ **GATE**: Do not proceed to Phase N (Polish) unless Global AC Coverage is 100%, all edge cases have test tasks, AND the pyramid distribution is within §II thresholds.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user story work
- **User Story 1 (Phase 3)**: Depends on Foundational — can begin once T008–T010 are complete
- **Polish (Phase N)**: Depends on Phase 3 being fully complete with all ACs verified

### Within User Story 1

```
T008 (type) ──────────────────┐
T009 (formatDate) ────────────┤
T010 (data) ──────────────────┤
                              ↓
T011–T017 (unit tests) ← WRITE FIRST — verify RED before implementing
T018–T019 (integration tests) ← WRITE FIRST — verify RED before implementing
T020 (E2E test) ← WRITE FIRST — verify RED before implementing
                              ↓
T021 (EventCard impl) ────────┐
T022 (EventGrid impl) ────────┤  ← implement until GREEN
                              ↓
T023 (page.tsx) ──────────────┐
T024 (layout.tsx) ────────────┤
                              ↓
                    All tests GREEN → Refactor → Phase N
```

### Parallel Opportunities

- T003, T004, T005, T006 — all Setup config tasks can run in parallel (different files)
- T009, T010 — Foundational tasks can run in parallel (different files)
- T011–T019 — all test tasks within US1 can run in parallel (different files)
- T021, T022 — EventCard and EventGrid implementation can run in parallel (different directories)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T007) — includes test infrastructure
2. Complete Phase 2: Foundational (T008–T010) — CRITICAL, blocks all story work
3. Write ALL tests for Phase 3 (T011–T020) — TDD Red: verify every test fails
4. Implement Phase 3 (T021–T024) — TDD Green: make tests pass
5. Refactor — TDD Refactor: clean up without breaking tests
6. **STOP and VALIDATE**: All ACs + edge cases verified, pyramid distribution within §II thresholds
7. Run Phase N: Polish (T025–T028)
8. Deploy/demo

### Parallel Team Strategy

With multiple developers (all depend on Phase 2 being complete):

- Developer A: Write + implement EventCard (T012, T013, T015, T016 tests → T021 implementation)
- Developer B: Write + implement EventGrid (T014, T017, T019 tests → T022 implementation)
- Developer C: Write + implement formatDate + page + E2E (T011 test → T009 impl; T018, T020 tests → T023, T024 impl)

Stories integrate at T023 (page.tsx imports both components and data). All developers own pyramid compliance for their components.

---

## Notes

- `[P]` tasks = different files, no dependencies on incomplete tasks — safe to run in parallel
- `[US1]` maps all test and implementation tasks to User Story 1 for full traceability
- **`[AC-SP001-US01-CRxx]`** maps each test task to a specific acceptance criterion from spec.md — `SP001` from branch `001-qa-conferences-dashboard`
- **Every AC in spec.md has at least one test task** — CR01 (3 tests), CR02 (1), CR03 (2), CR04 (1), CR05 (2) — 100% AC coverage
- **Every edge case has a test task inside Phase 3** — not deferred to Polish (Constitution §I + Edge Case Handling Rules)
- **Every test task includes a Test Decision Record** — level + justification + framework + rationale + file path
- **Pyramid respected at feature level**: 70% unit / 20% integration / 10% E2E (Constitution §II)
- **E2E test (T020) justified**: CR03/CR04 require real CSS layout computation at specific viewports; jsdom does not evaluate media queries — Playwright viewport emulation is the only faithful verifier
- Use `context.annotate('acceptance-criteria', 'SP001-US01-CR01')` in Vitest tests (≥4.1) and `{ tag: ['@ac-SP001-US01-CR01'] }` in Playwright tests for JUnit XML AC traceability (per CLAUDE.md Testing Standards)
- Verify tests FAIL before implementing (Red before Green — NON-NEGOTIABLE per Constitution §I)
- Commit after each task or logical group
- Stop at Phase 3 checkpoint to validate story independently and confirm pyramid distribution before proceeding to Polish

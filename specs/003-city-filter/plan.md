# Implementation Plan: Filter Conferences by City

**Branch**: `003-city-filter` | **Date**: 2026-06-19 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/003-city-filter/spec.md`

## Summary

Add a city drop-down selector above the conference grid that filters visible conferences by city, with an "All cities" default, a clear control, and an active-filter indicator. Implemented as a new `CityFilter` component and a `ConferenceDashboard` client component wrapping the existing `EventGrid`, with no new dependencies.

## Technical Context

**Language/Version**: TypeScript 5 / React 19 / Next.js 16

**Primary Dependencies**: React (`useState`), Tailwind CSS 4, React Testing Library, Vitest ≥4.1, Playwright

**Storage**: N/A — filter is transient UI state; conference data is a static in-memory array

**Testing**: Vitest (unit + integration), Playwright (E2E); both already configured with JUnit XML + HTML reporters

**Target Platform**: Browser (desktop + mobile, 375 px – 1440 px)

**Project Type**: Next.js web application

**Performance Goals**: No measurable change; filter operates on a static in-memory array (< 50 items)

**Constraints**: No new npm dependencies; filter must not require page reload (FR-009)

**Scale/Scope**: Single page; ~50 conferences in static data

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Principle I (Test-First)**: Acceptance scenarios fully defined in spec.md before any implementation code is written.
- [x] **Principle II (Testing Pyramid)**: Unit tests cover component logic (≥70%), integration tests cover `ConferenceDashboard` wiring (20–25%), E2E covers P1 user stories US1 and US2 (≤10%). Coverage thresholds configured in `vitest.config.ts`.
- [x] **Principle III (Code Quality)**: ESLint + TypeScript strict mode already configured; no new tooling needed. `CityFilter` logic is simple enough to stay under cyclomatic complexity 10.
- [x] **Principle IV (Specification-Driven)**: Every test annotated with AC identifier (`SP003-US0X-CRXX`). AC Coverage Matrix defined in `quickstart.md`.
- [x] **Principle V (Continuous Quality Gates)**: Existing CI pipeline runs `npm run test:ci && npm run test:e2e`; no changes needed.
- [x] **Principle VI (Defect Prevention)**: TypeScript strict typing; `tsc --noEmit` already in CI. No new security surface.

**Post-Phase 1 re-check**: All gates remain green. Native `<select>` + conditional render introduces no complexity violations.

## Project Structure

### Documentation (this feature)

```text
specs/003-city-filter/
├── plan.md              ← this file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── quickstart.md        ← Phase 1 output
├── contracts/
│   ├── CityFilter.contract.md
│   └── ConferenceDashboard.contract.md
└── tasks.md             ← Phase 2 output (/speckit-tasks — not yet created)
```

### Source Code (repository root)

```text
qa-conferences/
├── src/
│   ├── app/
│   │   └── page.tsx                        # converted to Server Component shell
│   ├── components/
│   │   ├── CityFilter/
│   │   │   ├── CityFilter.tsx              # NEW — drop-down + clear btn + indicator
│   │   │   └── CityFilter.test.tsx         # NEW — unit tests (all 13 ACs for US1–US4)
│   │   ├── ConferenceDashboard/
│   │   │   ├── ConferenceDashboard.tsx     # NEW — 'use client', owns selectedCity state
│   │   │   └── ConferenceDashboard.test.tsx # NEW — integration tests
│   │   └── EventGrid/                      # unchanged
│   └── data/
│       └── conferences.ts                  # unchanged
└── tests/
    └── e2e/
        └── dashboard.spec.ts               # MODIFIED — add city filter E2E scenarios
```

**Structure Decision**: Single Next.js application. New components follow the existing per-component directory pattern (`ComponentName/ComponentName.tsx` + `ComponentName.test.tsx`). `ConferenceDashboard` is extracted to keep `page.tsx` a Server Component.

## Complexity Tracking

No constitution violations.

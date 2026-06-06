# Implementation Plan: Layout — Top Bar, Sidebar & Typography

**Branch**: `002-layout-sidebar-topbar` | **Date**: 2026-06-06 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/002-layout-sidebar-topbar/spec.md`

## Summary

Add a persistent top bar (with a clickable logo home button) and a collapsible left sidebar (with a "Conferences" navigation item) to the QA Conferences dashboard. Apply **Geist Sans** (Vercel / Google Fonts, open-source) to all buttons and navigation bars via the `--font-ui` CSS custom property. Fix content margins so nothing bleeds to the viewport edges. The layout shell is implemented as a CSS Grid root layout in Next.js App Router's `layout.tsx`, with the sidebar toggle managed via React state persisted to localStorage.

## Technical Context

**Language/Version**: TypeScript 5 / Node 22

**Primary Dependencies**: Next.js 16.2.7 (App Router), React 19, Tailwind CSS v4

**Storage**: N/A (sidebar state via localStorage; no server-side storage)

**Testing**: Vitest 4.1 (unit + component, with `@testing-library/react`), Playwright 1.60 (E2E)

**Target Platform**: Desktop browser (Chrome, Firefox, Safari); mobile layout is out of scope for this feature

**Project Type**: Web application (frontend only)

**Performance Goals**: Sidebar toggle animation completes in ≤ 300 ms (SC-002)

**Constraints**: No additional UI component libraries; no server-side state for sidebar

**Scale/Scope**: Single-page shell wrapping one existing route (conferences dashboard); designed to accommodate future sidebar entries

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Principle I (Test-First)**: Acceptance scenarios defined in spec.md (US1–US4, FR-001–FR-012) before any implementation tasks are scheduled.
- [x] **Principle II (Testing Pyramid)**: Unit tests (TopBar, Sidebar, NavItem components) ≥ 70%; integration tests (layout shell + routing) ~20%; E2E (full user journey via Playwright) ≤ 10%.
- [x] **Principle III (Code Quality)**: ESLint + TypeScript already configured in the project; Tailwind v4 linting via PostCSS. Cyclomatic complexity of new components is low by design (no complex branching logic).
- [x] **Principle IV (Specification-Driven)**: Every test will be annotated with its AC identifier (`SP002-USxx-CRxx`) via Vitest `context.annotate` and Playwright `{ tag: ['@ac-SP002-USxx-CRxx'] }`.
- [x] **Principle V (Continuous Quality Gates)**: CI already runs `npm run test:all` (Vitest + Playwright). Coverage gate will be enforced via `@vitest/coverage-v8` threshold configuration.
- [x] **Principle VI (Defect Prevention)**: TypeScript strict mode active; ESLint with `@typescript-eslint`; no new dependencies introduced that require security scanning beyond existing setup.

## Project Structure

### Documentation (this feature)

```text
specs/002-layout-sidebar-topbar/
├── plan.md              ← this file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── quickstart.md        ← Phase 1 output
├── contracts/           ← Phase 1 output
│   └── components.ts    ← TypeScript prop interfaces
├── checklists/
│   └── requirements.md  ← quality checklist
└── tasks.md             ← Phase 2 output (created by /speckit-tasks)
```

### Source Code (repository root)

```text
qa-conferences/
├── src/
│   ├── app/
│   │   ├── layout.tsx          ← updated: adds AppShell (TopBar + Sidebar + content grid)
│   │   ├── globals.css         ← updated: --font-ui via Geist Sans, layout CSS vars
│   │   └── page.tsx            ← unchanged (content renders inside AppShell)
│   └── components/
│       ├── TopBar/
│       │   ├── TopBar.tsx
│       │   └── TopBar.test.tsx
│       ├── Sidebar/
│       │   ├── Sidebar.tsx
│       │   ├── Sidebar.test.tsx
│       │   └── NavItem.tsx
│       └── AppShell/
│           ├── AppShell.tsx    ← client component: owns sidebar expanded/collapsed state
│           └── AppShell.test.tsx
├── tests/
│   └── e2e/
│       └── layout.spec.ts      ← E2E: top bar, sidebar toggle, logo navigation
├── public/
└── vitest.config.ts            ← unchanged
```

**Structure Decision**: Web application (Option 2 adapted for a frontend-only Next.js project). The `AppShell` client component wraps all layout state logic, keeping `layout.tsx` as a Server Component that simply renders `<AppShell>{children}</AppShell>`. This ensures Next.js static caching is preserved for page content while the shell is interactive.

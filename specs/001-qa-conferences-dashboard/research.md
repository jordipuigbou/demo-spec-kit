# Research: QA Conferences Dashboard Spain

**Branch**: `001-qa-conferences-dashboard` | **Date**: 2026-06-06

All technology choices for this feature are either user-specified or straightforward defaults with no meaningful ambiguity. This file documents each decision and the rationale so the plan remains auditable.

---

## Decision 1: CSS / Styling Approach

**Decision**: Tailwind CSS 4.x

**Rationale**: User requested "modern but simple" aesthetic. Tailwind 4 ships with zero-config defaults for Next.js 15 (via `@tailwindcss/vite`), requires no separate config file for basic use, and produces utility classes that are readable by AI agents without extra context. No runtime overhead (purged at build time).

**Alternatives considered**:
- CSS Modules — more verbose, requires naming discipline, slower for rapid UI iteration
- styled-components / Emotion — runtime CSS-in-JS adds bundle weight and complexity; unnecessary for a static page
- Plain CSS — no design-system guarantees; harder to achieve consistent spacing/typography

---

## Decision 2: Unit/Component Testing Framework

**Decision**: Vitest ≥4.1 + `@testing-library/react` + `jsdom`

**Rationale**: Satisfies all four criteria from the CLAUDE.md Testing Standards:
1. Same ecosystem as production code (TypeScript/Vite toolchain)
2. AI-agent friendly: structured failure output, plain source test files, zero-config CLI; Vitest 4.1 adds the AI Agent Reporter for machine-readable output
3. JUnit XML via `@vitest/junit-reporter` (officially maintained); Vitest 4.1 `context.annotate` emits structured `<property>` elements in JUnit XML, replacing the earlier test-name-prefix workaround
4. Most active community for Vite-based React projects

Key Vitest 4.1 feature for this project: `context.annotate(type, content)` attaches structured metadata to each test case. Used for AC traceability: `await annotate('acceptance-criteria', 'SP001-US01-CR01')` writes a `<property name="acceptance-criteria" value="SP001-US01-CR01"/>` element into JUnit XML output, enabling exact AC queries without grepping test names.

Next.js 16 App Router components are testable with Vitest + jsdom without the full Next.js test renderer overhead.

**Alternatives considered**:
- Jest — requires additional Babel/SWC transform config for TypeScript + React; slower than Vitest; same test API surface
- React Testing Library alone — not a runner; must be paired with a runner (chosen: Vitest)

---

## Decision 3: E2E Testing Framework

**Decision**: Playwright ≥1.60

**Rationale**: First-class Next.js support (official Next.js docs use Playwright); native JUnit XML reporter; tag API for AC traceability; runs headless in CI without extra dependencies; supports 375 px mobile viewport emulation natively. Playwright 1.60 adds `page.consoleMessages()` and `page.pageErrors()` for richer assertion on runtime errors during E2E runs.

**Alternatives considered**:
- Cypress — heavier install, different async model, slightly less idiomatic for Next.js App Router
- Puppeteer — lower-level, no built-in test assertions or JUnit output

---

## Decision 4: Image Source Strategy

**Decision**: Curated Unsplash image URLs in mocked data + local SVG placeholder in `/public`

**Rationale**: Unsplash provides high-quality, license-free thematic photos (e.g., conference halls, developer laptops, QA dashboards) that satisfy FR-006 ("thematically relevant to QA/tech"). Each mocked event carries an `imageUrl` pointing to a sized Unsplash photo and an `imageAlt` string. The local `/public/images/placeholder.svg` is used as `<img>` fallback (FR-008) when the remote URL fails to load. This keeps the app fully static — no image CDN setup, no environment variables.

**Alternatives considered**:
- Bundled local photos — increases repo size; not needed for a demo
- Picsum / Lorem Picsum — generic, not thematically relevant
- `next/image` with `placeholder="blur"` — requires base64 blurDataURL for each image; adds complexity not justified for a demo

---

## Decision 5: Next.js Router Strategy

**Decision**: App Router (Next.js 15 default) with a single RSC page (`app/page.tsx`)

**Rationale**: App Router is the Next.js 15 standard and the direction of the framework. A single server component page renders the full mocked data synchronously — no client-side data fetching, no loading states, no hydration concerns. EventCard and EventGrid are client components only if they need interactivity (image `onError` handler requires `"use client"`).

**Alternatives considered**:
- Pages Router — legacy; not recommended for new projects since Next.js 13
- Static export (`output: "export"`) — viable but adds an extra config step; default build already achieves the same result for this all-static page

---

## Decision 6: Mocked Conference Events

**Decision**: 7 realistic-sounding (but entirely fictitious) Spanish QA/testing conference events defined in `src/data/conferences.ts`

Events included:

| Name | City | Date |
|------|------|------|
| TestingConf Madrid 2026 | Madrid | 12 Mar 2026 |
| QA Summit Barcelona | Barcelona | 23 Apr 2026 |
| TestBCN Spring | Barcelona | 15 May 2026 |
| Agile Testing Day España | Seville | 11 Jun 2026 |
| QA & Testing Week Madrid | Madrid | 17 Sep 2026 |
| SpainTest Valencia | Valencia | 8 Oct 2026 |
| TAQfest Bilbao | Bilbao | 20 Nov 2026 |

All names are invented for demonstration purposes; no claim is made about real events.

**Rationale**: 7 events exceed SC-003 (minimum 5) and provide enough variety to validate grid layout across multiple rows and cities.

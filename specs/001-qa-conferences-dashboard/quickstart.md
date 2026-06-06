# Quickstart & Validation Guide: QA Conferences Dashboard Spain

**Branch**: `001-qa-conferences-dashboard` | **Date**: 2026-06-06

This guide explains how to bootstrap the project, run all tests, and manually verify each acceptance scenario from `spec.md`. It is intentionally short on implementation detail — see `tasks.md` for step-by-step tasks and `data-model.md` for entity definitions.

---

## Prerequisites

- Node.js ≥ 20 LTS
- npm ≥ 10
- A modern browser (Chrome, Firefox, Safari, or Edge — current version)

---

## Setup

```bash
cd qa-conferences
npm install
npx playwright install --with-deps chromium
```

---

## Running the App

```bash
npm run dev
```

Open `http://localhost:3000` in a browser. The dashboard page should load immediately with 7 conference cards.

---

## Running Tests

### Unit & component tests (Vitest)

```bash
npm run test              # watch mode
npm run test:ci           # single run, exits with code on failure
```

Emits:
- `test-results/junit.xml` — JUnit XML (CI + AC traceability)
- `test-results/html/index.html` — human-readable HTML report

### E2E tests (Playwright)

```bash
npm run test:e2e          # headless, all browsers configured in playwright.config.ts
npm run test:e2e:ui       # interactive Playwright UI (development)
```

Emits:
- `playwright-report/results.xml` — JUnit XML
- `playwright-report/index.html` — HTML report

### Full CI suite

```bash
npm run test:all          # runs unit + E2E sequentially, fails fast
```

---

## Acceptance Scenario Verification

Verify each scenario from `spec.md → User Story 1` manually after `npm run dev`:

| AC | Scenario | How to verify |
|----|----------|---------------|
| AC-1 | Dashboard loads with a collection of cards | Open `localhost:3000`; confirm 7 cards are visible without any interaction |
| AC-2 | Each card shows name, date, city, and image | Inspect any card; verify all four fields are present and non-empty |
| AC-3 | Desktop grid layout | Resize browser to ≥1024 px wide; confirm cards form a multi-column grid |
| AC-4 | Mobile single-column layout | Resize browser to 375 px wide (or use DevTools mobile emulation); confirm single-column stack, no horizontal scroll |
| AC-5 | Human-readable date | Check date on any card; expected format: "12 de marzo de 2026" (Spanish locale) |

### Edge case verification

| Edge Case | How to verify |
|-----------|---------------|
| Image fallback | Open DevTools → Network → block the image URL of one event; reload; confirm the card still shows name/date/city with a placeholder visual |
| Long conference name | Temporarily change a name in `src/data/conferences.ts` to a 100-char string; confirm the card text wraps or truncates without breaking the layout |
| Empty events list | Temporarily change `CONFERENCES` export to `[]`; confirm the dashboard shows a friendly "no events" message |

---

## Coverage Targets

Per the project constitution (Principle II):

| Layer | Minimum share | Coverage threshold |
|-------|---------------|--------------------|
| Unit (Vitest) | ≥70% of test count | 80% line coverage overall |
| Integration | 20–25% of test count | Every component rendered in page context |
| E2E (Playwright) | ≤10% of test count | All P1 acceptance scenarios |

Check coverage after `npm run test:ci`:

```bash
open test-results/html/index.html
```

---

## JUnit XML & AC Traceability

Every test name is prefixed with its AC identifier:

```
[SP001-US01-CR01] renders a collection of event cards on load
[SP001-US01-CR02] each card displays name, date, city, and image
...
```

Query coverage from JUnit XML:

```bash
grep -o 'SP001-US01-CR[0-9]*' test-results/junit.xml | sort -u
```

All five CR identifiers (CR01–CR05) should appear for the feature to be considered complete (SC-004).

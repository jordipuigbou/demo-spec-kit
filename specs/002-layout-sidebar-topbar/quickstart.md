# Quickstart Validation Guide: Layout — Top Bar, Sidebar & Typography

**Feature**: `002-layout-sidebar-topbar` | **Branch**: `002-layout-sidebar-topbar`

This guide documents how to validate that the layout feature works end-to-end.
It is not an implementation guide — implementation details are in `tasks.md`.

## Prerequisites

- Node 22 installed
- Dependencies installed: `cd qa-conferences && npm install`
- Dev server available: `npm run dev` (runs on `http://localhost:3000`)

## Scenario 1: Top Bar Is Visible with Logo

**Goal**: Verify FR-001 and FR-002 (top bar persists, logo present and clickable).

```bash
# Start dev server
cd qa-conferences && npm run dev
```

1. Open `http://localhost:3000` in a browser.
2. **Expected**: A top bar spans the full width at the top of the viewport.
3. **Expected**: A logo mark (text or SVG) is visible on the left side of the top bar.
4. Click the logo.
5. **Expected**: The page navigates to (or reloads) the home/root route — same page.
6. **Expected**: The top bar remains visible after navigation.

**AC Coverage**: SP002-US01-CR01, SP002-US01-CR02, SP002-US01-CR03, SP002-US01-CR04

---

## Scenario 2: Sidebar Expands and Collapses

**Goal**: Verify FR-003 through FR-006 (sidebar renders, toggles, and state persists).

1. Open `http://localhost:3000`.
2. **Expected**: A sidebar is visible on the left side, below the top bar.
3. **Expected**: A "Conferencias" label is visible in the sidebar.
4. Click the sidebar collapse toggle (button on the sidebar or top bar).
5. **Expected**: The sidebar collapses within 300 ms to a narrower form; text label disappears.
6. Reload the page.
7. **Expected**: The sidebar remains collapsed (state persisted in localStorage).
8. Click the expand toggle.
9. **Expected**: The sidebar expands and the "Conferencias" label reappears.

**AC Coverage**: SP002-US02-CR01, SP002-US02-CR02, SP002-US02-CR03, SP002-US02-CR04

---

## Scenario 3: Conferences Navigation Item

**Goal**: Verify FR-007 (sidebar item navigates correctly).

1. Open `http://localhost:3000`.
2. Ensure the sidebar is expanded.
3. Click "Conferencias" in the sidebar.
4. **Expected**: User lands on the conferences dashboard (same page, `/`).
5. **Expected**: The conferences grid is visible.

**AC Coverage**: SP002-US02-CR05

---

## Scenario 4: Content Margins

**Goal**: Verify FR-008 and FR-009 (content is not bleeding to viewport edges).

1. Open `http://localhost:3000`.
2. Using browser DevTools, inspect the main content area.
3. **Expected**: There is a minimum of ~24 px padding between content and the viewport/sidebar/top bar boundaries.
4. Collapse the sidebar.
5. **Expected**: The main content area expands to fill the freed space; internal padding is preserved.

**AC Coverage**: SP002-US03-CR01, SP002-US03-CR02, SP002-US03-CR03

---

## Scenario 5: Untitled Sans / Inter Font Applied

**Goal**: Verify FR-010 and FR-011 (typography applied to buttons and nav).

1. Open `http://localhost:3000`.
2. Open DevTools → Elements → select any button or sidebar label.
3. Check computed `font-family`.
4. **Expected**: The computed font-family includes `Untitled Sans` (if font files present) or `Inter` as the active font.

**AC Coverage**: SP002-US04-CR01, SP002-US04-CR02, SP002-US04-CR03

---

## Running Automated Tests

```bash
cd qa-conferences

# Unit + component tests
npm run test:ci

# E2E tests (requires dev server on :3000)
npm run test:e2e

# Full suite
npm run test:all
```

**Expected output**: All tests pass. JUnit XML reports at:
- `reports/unit/junit.xml`
- `reports/e2e/junit.xml`

HTML reports:
- `reports/unit/html/index.html`
- `reports/e2e/html/index.html`

## Regression Check

Verify the existing conferences dashboard functionality is unaffected:

1. The conference card grid still renders all events.
2. Cards show correct title, date, location, and URL.
3. No visual overflow or broken layout in the main content area.
4. Existing unit tests still pass without modification.

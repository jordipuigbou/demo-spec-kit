# Research: Layout — Top Bar, Sidebar & Typography

**Feature**: `002-layout-sidebar-topbar` | **Date**: 2026-06-06

## Decision 1: Geist Sans Font Strategy

**Decision**: Use **Geist Sans** (Vercel / Google Fonts), loaded via `next/font/google` with `variable: '--font-geist'`. Apply the font via the CSS custom property `--font-ui: var(--font-geist), 'Geist', sans-serif`.

**Rationale**: The original spec requested Untitled Sans (Klim Type Foundry), a commercial typeface that requires a paid licence and local font files. After delivery of the initial implementation — which resulted in two 404 network errors for the missing `.woff2` files — the decision was made to replace it with a free, openly-licensed alternative of equivalent or better visual quality.

Geist Sans was chosen for the following reasons:

1. **No licence cost** — open-source, hosted by Google Fonts.
2. **Zero FOUT** — `next/font/google` self-hosts and injects a `size-adjust` fallback automatically.
3. **Purpose-built for UI** — designed by Vercel for developer tool interfaces; clean, highly legible at small sizes, modern weight range.
4. **Single variable swap** — the `--font-ui` CSS custom property means no component code changed.

**Alternatives Considered**:

- **Inter** — already used as a system fallback; overly familiar/generic for a primary UI font.
- **Plus Jakarta Sans** — more expressive but diverges slightly from the clean/neutral tone of the dashboard.
- **DM Sans** — slightly informal rounding; less neutral than Geist at small sizes.
- **Sora** — good option but narrower ecosystem adoption than Geist.

**Implementation**:

```tsx
// layout.tsx
import { Geist } from 'next/font/google'
const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
```

```css
/* globals.css */
--font-ui: var(--font-geist), 'Geist', sans-serif;
```

All components use `font-[family-name:var(--font-ui)]` — no component-level changes required.

---

## Decision 2: Collapsible Sidebar State Management

**Decision**: Manage sidebar expanded/collapsed state with `useState` in the `AppShell` client component. Persist to `localStorage` via a `useEffect` on state change. Read the initial value from `localStorage` on mount.

**Rationale**: The sidebar state is a single boolean that affects only the shell layout. Lifting it into a React Context or a global store would add complexity without benefit for a single concern used at one level of the component tree. `useState` + `localStorage` gives:
- Zero re-renders outside the shell components.
- Persistence across page reloads without requiring a server round-trip.
- No additional libraries.

**CSS transition**: Tailwind v4 supports `transition-[width]` as an arbitrary property transition. Apply `duration-300 ease-in-out` for a perceptually instant but smooth collapse (aligns with SC-002 ≤ 300 ms).

```
Expanded:  w-64   (256px)
Collapsed: w-16   (64px)
```

The content area automatically fills the remaining space via `flex-1` or CSS Grid `1fr`.

**Alternatives Considered**:
- **React Context** — overkill; the sidebar state is not needed more than 2 levels deep.
- **URL search params** (`?sidebar=collapsed`) — pollutes history; back button breaks UX.
- **CSS-only checkbox hack** — not compatible with Server Component boundary; forces client rendering of the sidebar toggle.
- **Zustand / Jotai** — adds a dependency; excessive for one boolean.

---

## Decision 3: Persistent Layout Shell Architecture

**Decision**: CSS Grid root layout in `layout.tsx` with the `AppShell` Client Component owning layout state. The grid has two rows (top bar, content) and two columns (sidebar, main). The sidebar column width is driven by the expanded/collapsed state via inline style or a CSS custom property.

**Rationale**: CSS Grid with `grid-template-areas` is the most maintainable approach for a two-panel layout with a fixed header:
- Sidebar width change does not reflow the main content — it resizes the column.
- The layout can be expressed declaratively in a single `grid-template` declaration.
- `layout.tsx` can remain a Server Component; only `AppShell` needs `'use client'`.

```css
/* Conceptual grid */
grid-template-rows: 4rem 1fr;          /* top bar height, content */
grid-template-columns: var(--sidebar-w) 1fr;  /* sidebar, main */
grid-template-areas:
  "topbar  topbar"
  "sidebar main";
```

The `--sidebar-w` CSS variable is toggled from `16rem` (expanded) to `4rem` (collapsed) by the `AppShell` component.

**Alternatives Considered**:
- **Flexbox column** — content reflows on sidebar width change, causing layout jank.
- **Absolute/fixed sidebar** — main content needs explicit `margin-left` management; fragile on resize.
- **Per-route layout wrapping** — top bar and sidebar lose persistence across navigations.

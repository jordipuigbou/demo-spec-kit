# Data Model: Layout — Top Bar, Sidebar & Typography

**Feature**: `002-layout-sidebar-topbar` | **Date**: 2026-06-06

This feature introduces no server-side data entities. All state is client-side UI state.

## UI State Entities

### SidebarState

Represents the current visual state of the sidebar navigation panel.

| Field      | Type      | Values             | Default    | Description                              |
| ---------- | --------- | ------------------ | ---------- | ---------------------------------------- |
| `expanded` | `boolean` | `true` / `false`   | `true`     | Whether the sidebar shows text labels    |

**Persistence**: Stored in `localStorage` under key `sidebar-expanded`. Read on mount; written on every toggle.

**Transitions**:
- `expanded: true` → `expanded: false`: User clicks the collapse toggle
- `expanded: false` → `expanded: true`: User clicks the expand toggle

### NavItem

Represents a single navigation entry in the sidebar.

| Field    | Type     | Required | Description                                      |
| -------- | -------- | -------- | ------------------------------------------------ |
| `id`     | `string` | Yes      | Unique identifier used as React key              |
| `label`  | `string` | Yes      | Human-readable label shown in expanded state     |
| `href`   | `string` | Yes      | Navigation target (Next.js `Link` `href`)        |
| `icon`   | `string` | No       | Optional icon identifier shown in collapsed state |

**Initial dataset** (hardcoded for this feature):

```
id: "conferences"
label: "Conferencias"
href: "/"
icon: "calendar"
```

### LogoMark

Conceptual entity for the top bar logo. Not a data entity — it is a static asset and a navigation link.

| Attribute         | Value                                       |
| ----------------- | ------------------------------------------- |
| Display           | Invented brand mark (text-based or SVG)     |
| Navigation target | `/` (home/root)                             |
| Fallback behavior | Text "QA" if image fails to load            |

## Layout Dimensions

These are design constants, not runtime data, but they govern the visual model:

| Constant         | Expanded Value | Collapsed Value | CSS Variable        |
| ---------------- | -------------- | --------------- | ------------------- |
| Sidebar width    | 256 px (16rem) | 64 px (4rem)    | `--sidebar-w`       |
| Top bar height   | 64 px (4rem)   | —               | `--topbar-h`        |
| Content padding  | 24 px (1.5rem) | —               | `--content-padding` |

## Font Stack

| Usage              | Primary                        | Fallback       |
| ------------------ | ------------------------------ | -------------- |
| Buttons, nav bars  | Geist Sans (Google Fonts)      | sans-serif     |
| Body text          | Geist Sans (inherited)         | system-ui      |

**CSS variable**: `--font-ui: var(--font-geist), 'Geist', sans-serif;`

**Loading**: `next/font/google` self-hosts Geist and injects `--font-geist` via the `html` class. No external network requests at runtime.

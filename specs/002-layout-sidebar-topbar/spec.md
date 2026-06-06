# Feature Specification: Layout Improvement — Top Bar, Sidebar & Typography

**Feature Branch**: `002-layout-sidebar-topbar`

**Created**: 2026-06-06

**Status**: Draft

**Input**: User description: "Mejora del layout con top bar, sidebar colapsable y fuentes para botones y barras. El contenido sin márgenes."

**Font**: **Plus Jakarta Sans** (Google Fonts) — fuente open-source, sin coste de licencia, categoría geométrica-humanista con mayor personalidad que Geist. Reemplaza la elección inicial de Plus Jakarta Sans.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consistent Top Bar Navigation (Priority: P1)

As a user navigating the application, I see a persistent top bar at the top of every page. The top bar contains a branded logo that I can click to return to the home view from any location within the app.

**Why this priority**: The top bar is the primary structural anchor of the application layout. Without it, users have no consistent home reference point and the interface feels unstructured.

**Independent Test**: Load the conferences dashboard. The top bar is visible with a logo mark. Click the logo. The page reloads or navigates to the root/home route. The top bar remains visible after navigation.

**Acceptance Scenarios**:

1. **Given** the application is open on any page, **When** the page renders, **Then** a top bar is visible at the top of the screen spanning the full width above all other content.
2. **Given** the top bar is rendered, **When** the user inspects it, **Then** a logo mark is visible on the left side of the top bar.
3. **Given** the user is on any page, **When** the user clicks the logo, **Then** the user is navigated to the home/root view of the application.
4. **Given** the user navigates between pages, **When** any page is active, **Then** the top bar remains persistently visible and does not disappear or re-render.

---

### User Story 2 - Collapsible Sidebar Navigation (Priority: P1)

As a user, I can see a sidebar on the left side of the application that contains navigation items. The sidebar includes a "Conferences" entry as its primary item. I can collapse and expand the sidebar to reclaim screen space when needed.

**Why this priority**: The sidebar is the primary navigation mechanism for the application's sections. Without it, users cannot move between sections and content lacks structure.

**Independent Test**: Load the application. Verify the sidebar is visible on the left with a "Conferences" item. Click the collapse control. Verify the sidebar shrinks (icons only or hidden). Click expand. Verify the sidebar returns to its full state with labels visible.

**Acceptance Scenarios**:

1. **Given** the application is open, **When** the page renders, **Then** a sidebar is visible on the left side of the screen below the top bar.
2. **Given** the sidebar is expanded, **When** the user inspects it, **Then** a "Conferences" navigation item is visible with a label.
3. **Given** the sidebar is expanded, **When** the user clicks the collapse control, **Then** the sidebar collapses to a narrower form (hiding text labels, keeping icon or minimal indicator if applicable).
4. **Given** the sidebar is collapsed, **When** the user clicks the expand control, **Then** the sidebar returns to its full expanded state with the "Conferences" label visible.
5. **Given** the sidebar is visible (expanded or collapsed), **When** the user clicks the "Conferences" item, **Then** the user is navigated to the conferences section/view.

---

### User Story 3 - Content Margins & Spacing (Priority: P2)

As a user reading content in the main area, I see content that is properly inset from the screen edges and from the top bar and sidebar. Content does not bleed to the browser edges.

**Why this priority**: Without margins, content is visually cramped and difficult to read. This directly affects usability of all existing features.

**Independent Test**: Open the conferences dashboard. Verify that the main content area has visible space between itself and: the top of the viewport (top bar), the left edge (sidebar), and the right and bottom edges of the viewport.

**Acceptance Scenarios**:

1. **Given** the application is open with content displayed, **When** the page renders, **Then** the main content area has visible horizontal and vertical margins so no content touches the viewport edges.
2. **Given** the top bar and sidebar are present, **When** the content area is rendered, **Then** the content is offset below the top bar and to the right of the sidebar without overlap.
3. **Given** the sidebar is collapsed, **When** the content area reflows, **Then** the content area expands to fill the newly available space while preserving its internal margins.

---

### User Story 4 - Typography: Plus Jakarta Sans on Interactive Elements (Priority: P3)

As a user interacting with buttons and navigation bars, I experience a consistent typographic style using the **Plus Jakarta Sans** typeface on all interactive controls (buttons, top bar, sidebar labels).

**Why this priority**: Typography consistency is a visual polish concern. It does not block functional usage but significantly affects perceived quality.

**Independent Test**: Inspect the rendered buttons and sidebar labels in the browser developer tools. The font-family in use for these elements includes `Geist` in the computed stack.

**Acceptance Scenarios**:

1. **Given** the application is open, **When** any button is rendered, **Then** the button label uses the Plus Jakarta Sans typeface (or its system fallback).
2. **Given** the top bar is rendered, **When** the user inspects text within it, **Then** text elements in the top bar use the Plus Jakarta Sans typeface.
3. **Given** the sidebar is rendered, **When** the user inspects navigation item labels, **Then** sidebar labels use the Plus Jakarta Sans typeface.

---

### Edge Cases

- What happens when the sidebar is collapsed and the screen is very narrow (mobile viewport)? Assumed out of scope for v1 — desktop-first layout is sufficient.
- What happens if the Geist font fails to load? The application MUST fall back gracefully to a system sans-serif font; text MUST remain legible.
- What happens when the top bar logo image fails to load? A text fallback or placeholder MUST ensure the click target remains functional.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The application MUST render a persistent top bar at the top of every page, spanning the full viewport width.
- **FR-002**: The top bar MUST contain a logo mark that is clickable and navigates the user to the home/root route of the application.
- **FR-003**: The application MUST render a sidebar on the left side of every page, positioned below the top bar.
- **FR-004**: The sidebar MUST display a "Conferences" navigation item with a speaker/megaphone SVG icon and a visible label in its expanded state. In its collapsed state, the icon MUST remain visible and be horizontally centered.
- **FR-005**: The sidebar MUST support a collapsed state that hides text labels and reduces its rendered width.
- **FR-006**: The sidebar MUST include a visible toggle control that allows the user to switch between expanded and collapsed states.
- **FR-007**: Clicking the "Conferences" sidebar item MUST navigate the user to the conferences section.
- **FR-008**: The main content area MUST have consistent internal margins so that content does not touch the viewport edges.
- **FR-009**: The main content area MUST automatically adjust its width and position when the sidebar is toggled.
- **FR-010**: All rendered buttons in the application MUST use the Plus Jakarta Sans typeface (with an appropriate fallback stack).
- **FR-011**: Navigation bars (top bar, sidebar labels) MUST use the Plus Jakarta Sans typeface (with an appropriate fallback stack).
- **FR-012**: The application layout MUST be responsive to sidebar state changes without requiring a full page reload.

### Key Entities

- **Top Bar**: The horizontal navigation strip at the top of the viewport. Contains: logo (home button), and reserved space for future controls.
- **Logo Mark**: A brand identifier within the top bar that doubles as a home navigation link. Invented brand for demo purposes.
- **Sidebar**: The vertical navigation panel on the left side of the content area. Has two states: expanded (labels visible) and collapsed (labels hidden).
- **Navigation Item**: An individual entry in the sidebar (currently: "Conferences"). Has a label and a navigation target.
- **Main Content Area**: The region of the layout below the top bar and to the right of the sidebar where page-specific content is rendered.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify the home navigation element (logo) on first encounter without assistance — target: 100% recognition in manual review.
- **SC-002**: Toggling the sidebar between expanded and collapsed states completes in under 300 ms (visually instant to the user).
- **SC-003**: All content in the main area has a minimum margin of at least 16 px from each viewport edge and from the sidebar/top bar boundaries.
- **SC-004**: The Plus Jakarta Sans typeface is applied consistently to 100% of buttons and navigation bar labels (verified by visual inspection or automated style audit).
- **SC-005**: No existing functional content (conference list, dashboard data) is broken or hidden as a result of the layout changes.

## Assumptions

- **Visual reference**: The overall aesthetic should be inspired by modern developer-tool dashboards (e.g., the layout style of nextjs.org/showcase): clean top bar, subtle left sidebar, ample white space, and a maximum-width content container that does not stretch to full screen on large monitors.
- The application is a desktop-first web application; mobile/responsive layouts are out of scope for this feature.
- The "Plus Jakarta Sans" font is available or can be bundled with the project; if unavailable, a standard sans-serif system font serves as the fallback.
- The logo mark is an invented/placeholder brand for demo purposes — no specific brand guidelines apply.
- The "Conferences" sidebar item links to the already-implemented conferences dashboard (feature 001).
- The sidebar collapsed state hides text labels and displays only the navigation icons, horizontally centered within the collapsed width.
- The current application has a single top-level route (the conferences dashboard); the home navigation target is that same route.

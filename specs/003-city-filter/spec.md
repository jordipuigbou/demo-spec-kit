# Feature Specification: Filter Conferences by City

**Feature Branch**: `003-city-filter`

**Created**: 2026-06-07

**Status**: Draft

**Input**: User description: "Me gustaría añadir un selector tipo drop-down que me permita filtrar las conferencias por la ciudad donde se celebra. Por defecto el selector estará sin seleccionar, es decir, no filtrará por ninguna ciudad. Si el usuario abre el selector y selecciona una de las opciones solamente debemos ver las conferencias de esa ciudad seleccionada. El selector debe permitir limpiar ese filtrado o volver al estado inicial donde se muestren todas las conferencias sin importar la ciudad. Cuando se haya filtrado por una ciudad será visible que se está filtrando y por qué ciudad."

## Clarifications

### Session 2026-06-07

- Q: How should the visitor clear the active city filter? → A: Provide both an "All cities" entry at the top of the drop-down AND a separate explicit "Clear filter" control shown when a filter is active.
- Q: In what order should the cities appear in the drop-down? → A: Alphabetical (A→Z) by city name.
- Q: Where should the city selector be placed in the layout? → A: Above the conference grid, within the main content area.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Filter conferences by a chosen city (Priority: P1)

A visitor browsing the conferences dashboard wants to narrow the list down to events happening in a specific city. They open a drop-down selector, pick a city from the available options, and the dashboard immediately shows only the conferences held in that city, hiding all others.

**Why this priority**: This is the core value of the feature. Without the ability to select a city and see a filtered result, the feature does not exist. Everything else (default state, clearing, indicator) supports this primary action.

**Independent Test**: Can be fully tested by opening the dashboard, selecting a city from the drop-down, and verifying that only conferences from that city remain visible while all others are hidden.

**Acceptance Scenarios**:

1. **Given** the dashboard is loaded with conferences from multiple cities, **When** the visitor opens the city drop-down, **Then** the drop-down lists each city that has at least one conference, with no duplicate city entries.
2. **Given** the city drop-down is open, **When** the visitor selects a specific city, **Then** the dashboard displays only the conferences held in that city and hides all conferences from other cities.
3. **Given** a city has been selected and the list is filtered, **When** the visitor selects a different city, **Then** the dashboard updates to show only conferences from the newly selected city.
4. **Given** a city is selected, **When** the filtered results are shown, **Then** the count and content of visible cards corresponds exactly to the conferences belonging to that city.

---

### User Story 2 - Default unfiltered state (Priority: P1)

When a visitor first arrives at the dashboard, the city selector starts in an unselected state so that all conferences are shown regardless of city. No action is required to see the complete list.

**Why this priority**: The dashboard must remain fully usable for visitors who do not want to filter. The unfiltered default guarantees the feature is additive and never hides content unexpectedly. It is foundational to the filtering experience and must ship alongside US1.

**Independent Test**: Can be fully tested by loading the dashboard fresh and verifying the selector shows no city chosen and every conference is visible.

**Acceptance Scenarios**:

1. **Given** the visitor opens the dashboard for the first time, **When** the page finishes loading, **Then** the city selector shows an unselected / "all cities" state and every conference is displayed.
2. **Given** the selector is in its default unselected state, **When** the visitor looks at the conference list, **Then** no city-based filtering is applied and conferences from all cities are visible.

---

### User Story 3 - Clear the filter and return to all conferences (Priority: P2)

After filtering by a city, the visitor wants to remove the filter and see the full list again without reloading the page. The selector offers a way to clear the selection and return to the initial unfiltered state.

**Why this priority**: Clearing the filter is essential for a good experience but depends on US1 and US2 existing first. A visitor can still get value from filtering even before clearing is polished, so it is one step below the core.

**Independent Test**: Can be fully tested by selecting a city, then using the clear/reset control, and verifying all conferences from all cities are shown again and the selector returns to its unselected state.

**Acceptance Scenarios**:

1. **Given** a city filter is active, **When** the visitor chooses the "All cities" entry at the top of the drop-down, **Then** all conferences from every city become visible again.
2. **Given** a city filter is active, **When** the visitor activates the explicit "Clear filter" control, **Then** all conferences from every city become visible again.
3. **Given** the visitor has cleared the filter by either means, **When** the dashboard updates, **Then** the selector returns to its default "All cities" state and no active-filter indicator (and no "Clear filter" control) is shown.
4. **Given** a city filter is active, **When** the visitor clears it, **Then** the result is identical to the original default state of the dashboard.

---

### User Story 4 - Visible indication of the active filter (Priority: P2)

When a city filter is applied, the visitor can clearly see that the list is being filtered and by which city, so they are never confused about why some conferences are missing.

**Why this priority**: Visibility prevents confusion ("where did the other events go?") and builds trust in the filtering. It enhances US1 but the core filtering can function before the indicator is fully styled, so it sits alongside clearing at P2.

**Independent Test**: Can be fully tested by selecting a city and verifying a visible indicator names the active city, and that the indicator disappears when the filter is cleared.

**Acceptance Scenarios**:

1. **Given** the visitor has selected a city, **When** the list is filtered, **Then** a visible indicator communicates that filtering is active and names the city being filtered by.
2. **Given** the filter indicator is visible, **When** the visitor reads it, **Then** the displayed city name matches the city currently selected in the drop-down.
3. **Given** no city is selected, **When** the visitor views the dashboard, **Then** no active-filter indicator is shown.

---

### Edge Cases

- **No conferences for a selected city**: Because the drop-down only lists cities that have at least one conference, every selectable city yields at least one result; an empty filtered list should therefore not occur through normal selection. If it does occur, the dashboard MUST show a friendly "no conferences match this filter" message rather than a blank area.
- **Single city across all data**: If all conferences happen to be in one city, the drop-down still functions and selecting that city shows the same set as the default state.
- **Long city names**: A city name that is unusually long MUST not break the selector or the active-filter indicator layout; it must truncate or wrap gracefully.
- **Case / accent consistency**: City names that differ only by capitalization or accents (e.g., "Málaga" vs "Malaga") MUST be treated consistently so the same city does not appear as two separate options.
- **Filter persistence on resize**: Changing viewport size (desktop ↔ mobile) while a filter is active MUST keep the current filter applied; the filtered result remains correct.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The dashboard MUST provide a drop-down selector that lets the visitor filter conferences by the city where each conference is held.
- **FR-002**: The selector MUST start in an unselected (default) state in which no city filter is applied and all conferences are displayed.
- **FR-003**: The selector's options MUST be derived from the cities present in the conference data, listing each distinct city exactly once (alphabetically, A→Z, by city name) and excluding cities with no conferences. The list MUST also include an "All cities" entry at the top representing the default unfiltered state.
- **FR-004**: When the visitor selects a city, the dashboard MUST display only the conferences held in that city and hide all conferences from other cities.
- **FR-005**: When the visitor changes the selection to a different city, the dashboard MUST update to reflect only the conferences of the newly selected city.
- **FR-006**: The visitor MUST be able to clear the active filter and return to the default unfiltered state through two means: (a) selecting the "All cities" entry in the drop-down, and (b) an explicit "Clear filter" control that is shown only while a filter is active. Both MUST produce the same unfiltered result.
- **FR-012**: The city selector MUST be placed above the conference grid, within the main content area of the dashboard (not in the topbar or sidebar).
- **FR-007**: When a city filter is active, the dashboard MUST display a visible indicator that communicates both that filtering is active and which city is being filtered by.
- **FR-008**: When the filter is in its default unselected state (or after being cleared), the active-filter indicator MUST NOT be shown.
- **FR-009**: Filtering MUST operate on the existing pre-loaded conference data without requiring page reload or external data fetching.
- **FR-010**: The filtering behaviour and the selector MUST remain usable and correctly laid out across desktop and mobile viewport sizes.
- **FR-011**: If a filtered result contains no conferences, the dashboard MUST display a friendly message indicating no conferences match the current filter, rather than an empty or broken layout.

### Key Entities

- **Conference Event**: An existing entity representing a single QA/testing event. Relevant attribute for this feature: **city** (the location where the event is held), used both as the filter criterion and as the source of the selector's options.
- **City Filter Selection**: Represents the visitor's current filtering choice. States: *unselected* (no filter, all conferences shown) or *a specific city* (only that city's conferences shown). This selection is transient interface state, not persisted data.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: From the default dashboard, a visitor can apply a city filter and see only that city's conferences in 2 interactions or fewer (open selector, choose city).
- **SC-002**: When a city is selected, 100% of visible conference cards belong to that city and 0% belong to any other city.
- **SC-003**: A visitor can return from any filtered state to the full unfiltered list in a single interaction (clear/reset), and the resulting list is identical to the initial default state.
- **SC-004**: Whenever a filter is active, 100% of the time a visible indicator naming the active city is present; whenever no filter is active, the indicator is absent.
- **SC-005**: The selector lists each city that has conferences exactly once, with zero duplicate entries, ordered alphabetically (A→Z), with an "All cities" entry at the top, for any valid conference dataset.
- **SC-006**: 100% of the acceptance scenarios defined across all user stories pass automated tests before the feature is considered complete.
- **SC-007**: The selector and filtered results render correctly without layout breakage on screen widths from 375 px (mobile) to 1440 px (desktop).

## Assumptions

- This feature extends the existing QA Conferences Dashboard (feature 001) and reuses its pre-loaded, static conference data; no backend, database, or external API is introduced.
- The city used for filtering is the same `city` attribute already present on each conference event.
- Only one city can be filtered at a time; multi-city / multi-select filtering is out of scope for this version.
- The filter selection is interface-only state and does not need to persist across page reloads, browser sessions, or be encoded in the URL (unless added later as an enhancement).
- The "clear filter" capability is realized through both an "All cities" option in the drop-down and a separate explicit "Clear filter" control shown while a filter is active (see FR-006).
- Cities are listed alphabetically (A→Z) in the drop-down, with an "All cities" entry pinned at the top.
- The selector is positioned above the conference grid within the main content area; it is not part of the topbar or sidebar introduced in feature 002.
- No user authentication or personalization is involved; the filter is available to all visitors.
- Accessibility expectations match the existing dashboard: readable labels, keyboard operability of the selector, and sufficient contrast, without a formally mandated WCAG level for this version.

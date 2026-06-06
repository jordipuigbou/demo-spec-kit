import type { ConferenceEvent } from "./ConferenceEvent";

/**
 * Props contract for the EventCard component.
 *
 * The component receives a single ConferenceEvent and renders it as a card.
 * It owns image fallback behaviour internally (onError → placeholder).
 *
 * Spec ref: spec.md → FR-002, FR-006, FR-008
 */
export interface EventCardProps {
  /** The conference event data to display */
  event: ConferenceEvent;
}

/**
 * Props contract for the EventGrid component.
 *
 * Receives the full list of events and renders them in a responsive grid.
 * Renders an empty-state message when the array is empty.
 *
 * Spec ref: spec.md → FR-001, FR-007, Edge Cases (empty list)
 */
export interface EventGridProps {
  /** Array of conference events to display. May be empty. */
  events: ConferenceEvent[];
}

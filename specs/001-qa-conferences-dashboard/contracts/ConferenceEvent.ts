/**
 * Canonical contract for a QA/testing conference event.
 * This type is the single source of truth for the shape of mocked data
 * and all component props that consume event information.
 *
 * Spec ref: spec.md → Key Entities → ConferenceEvent
 */
export interface ConferenceEvent {
  /** Unique stable identifier (kebab-case, e.g. "madrid-testingconf-2026") */
  id: string;

  /** Full display name of the conference/event */
  name: string;

  /**
   * Event date as an ISO 8601 string (e.g. "2026-03-12").
   * Formatted for display at render time using Intl.DateTimeFormat.
   */
  date: string;

  /** City where the event takes place */
  city: string;

  /** URL of the thematic representative image */
  imageUrl: string;

  /** Descriptive alt text for the image (required for accessibility) */
  imageAlt: string;
}

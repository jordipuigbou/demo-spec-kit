# Data Model: QA Conferences Dashboard Spain

**Branch**: `001-qa-conferences-dashboard` | **Date**: 2026-06-06

---

## Entity: ConferenceEvent

The sole data entity in this feature. All instances are static; no mutations, no persistence layer.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Unique stable identifier for the event (e.g., `"madrid-testingconf-2026"`) |
| `name` | `string` | Yes | Full display name of the conference/event |
| `date` | `string` | Yes | ISO 8601 date string (e.g., `"2026-03-12"`) — formatted for display at render time |
| `city` | `string` | Yes | City name where the event takes place |
| `imageUrl` | `string` | Yes | URL of the thematic representative image |
| `imageAlt` | `string` | Yes | Descriptive alt text for the image (accessibility) |

**Validation rules** (enforced by TypeScript type; no runtime schema):
- All fields are non-optional; there are no nullable fields.
- `date` MUST be a valid ISO date string parseable by `new Date()`.
- `id` MUST be unique across all entries in the mocked data array.

**State transitions**: N/A — entity is read-only.

**Relationships**: None — ConferenceEvent has no relationships to other entities in this version.

---

## Mocked Data Shape (TypeScript)

```typescript
// src/types/conference.ts
export interface ConferenceEvent {
  id: string;
  name: string;
  date: string;        // ISO 8601, e.g. "2026-03-12"
  city: string;
  imageUrl: string;
  imageAlt: string;
}
```

---

## Mocked Instances

Defined in `src/data/conferences.ts` as a `ConferenceEvent[]` constant exported as `CONFERENCES`.

| id | name | date | city |
|----|------|------|------|
| `madrid-testingconf-2026` | TestingConf Madrid 2026 | 2026-03-12 | Madrid |
| `barcelona-qa-summit-2026` | QA Summit Barcelona | 2026-04-23 | Barcelona |
| `testbcn-spring-2026` | TestBCN Spring | 2026-05-15 | Barcelona |
| `seville-agile-testing-2026` | Agile Testing Day España | 2026-06-11 | Seville |
| `madrid-qa-week-2026` | QA & Testing Week Madrid | 2026-09-17 | Madrid |
| `valencia-spaintest-2026` | SpainTest Valencia | 2026-10-08 | Valencia |
| `bilbao-taqfest-2026` | TAQfest Bilbao | 2026-11-20 | Bilbao |

---

## Display Formatting

`date` (ISO string) is formatted for display using `Intl.DateTimeFormat` with locale `es-ES` and options `{ day: 'numeric', month: 'long', year: 'numeric' }`, producing output such as "12 de marzo de 2026". This satisfies `spec.md` AC-5.

import type { ConferenceEvent } from '@/types/conference'
import { EventCard } from '@/components/EventCard/EventCard'

interface EventGridProps {
  events: ConferenceEvent[]
}

export function EventGrid({ events }: EventGridProps) {
  if (events.length === 0) {
    return (
      <p className="text-center text-gray-500 py-16 text-lg">
        No hay eventos disponibles en este momento.
      </p>
    )
  }

  return (
    <div
      data-testid="event-grid"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}

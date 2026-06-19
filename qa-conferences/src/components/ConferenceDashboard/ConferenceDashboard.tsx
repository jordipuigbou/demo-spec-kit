'use client'

import { useState } from 'react'
import { CONFERENCES } from '@/data/conferences'
import type { ConferenceEvent } from '@/types/conference'
import { CityFilter } from '@/components/CityFilter/CityFilter'
import { EventGrid } from '@/components/EventGrid/EventGrid'

export function deriveCities(events: ConferenceEvent[]): string[] {
  return [...new Set(events.map((e) => e.city.trim()))].sort()
}

export function filterEvents(events: ConferenceEvent[], city: string): ConferenceEvent[] {
  return events.filter((e) => e.city.trim() === city)
}

export function ConferenceDashboard() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const cities = deriveCities(CONFERENCES)
  const filteredEvents = selectedCity ? filterEvents(CONFERENCES, selectedCity) : CONFERENCES

  return (
    <div className="max-w-5xl px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Conferencias QA en España</h1>
      <p className="text-gray-600 mb-6">Próximos eventos de calidad y testing en España</p>
      <CityFilter cities={cities} selectedCity={selectedCity} onChange={setSelectedCity} />
      <div className="mt-6">
        <EventGrid events={filteredEvents} />
      </div>
    </div>
  )
}

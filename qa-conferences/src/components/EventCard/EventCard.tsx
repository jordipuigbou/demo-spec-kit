'use client'

import { useState } from 'react'
import type { ConferenceEvent } from '@/types/conference'
import { formatDate } from '@/lib/formatDate'

interface EventCardProps {
  event: ConferenceEvent
}

export function EventCard({ event }: EventCardProps) {
  const [imgSrc, setImgSrc] = useState(event.imageUrl)

  return (
    <article className="rounded-xl overflow-hidden shadow-md bg-white flex flex-col">
      <div className="relative h-48 bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={event.imageAlt}
          className="w-full h-full object-cover"
          onError={() => setImgSrc('/images/placeholder.svg')}
        />
      </div>
      <div className="p-4 flex flex-col gap-1">
        <h2 className="text-lg font-semibold truncate overflow-hidden">{event.name}</h2>
        <p className="text-sm text-gray-600">{formatDate(event.date)}</p>
        <p className="text-sm text-gray-500">{event.city}</p>
      </div>
    </article>
  )
}

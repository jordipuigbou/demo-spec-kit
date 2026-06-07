import { CONFERENCES } from '@/data/conferences'
import { EventGrid } from '@/components/EventGrid/EventGrid'

export default function Home() {
  return (
    <div className="max-w-5xl px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Conferencias QA en España
      </h1>
      <p className="text-gray-600 mb-12">
        Próximos eventos de calidad y testing en España
      </p>
      <EventGrid events={CONFERENCES} />
    </div>
  )
}

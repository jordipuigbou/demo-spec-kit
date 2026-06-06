import { CONFERENCES } from '@/data/conferences'
import { EventGrid } from '@/components/EventGrid/EventGrid'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Conferencias QA en España
        </h1>
        <p className="text-gray-600 mb-8">
          Próximos eventos de calidad y testing en España
        </p>
        <EventGrid events={CONFERENCES} />
      </div>
    </main>
  )
}

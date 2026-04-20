import { prisma } from '@cc/db'
import { formatDate } from '@/lib/utils'
import { CreateEventButton } from './create-event-button'

export default async function AdminEventsPage() {
  const events = await prisma.programmingEvent.findMany({
    include: { rsvps: true },
    orderBy: { startTime: 'desc' },
  })

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold mb-1">Events</h1>
          <p className="text-muted-foreground">{events.length} total events</p>
        </div>
        <CreateEventButton />
      </div>

      <div className="space-y-3">
        {events.map((event) => {
          const isPast = new Date(event.startTime) < new Date()
          return (
            <div key={event.id} className={`bg-card border border-border rounded-2xl p-5 ${isPast ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-serif text-lg font-bold">{event.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{event.eventType}</span>
                    {isPast && <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Past</span>}
                  </div>
                  {event.description && <p className="text-sm text-muted-foreground mb-2">{event.description}</p>}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{formatDate(event.startTime)}</span>
                    <span>{event.isVirtual ? 'Virtual' : (event.location ?? 'No location')}</span>
                    <span>{event.rsvps.length} RSVP{event.rsvps.length !== 1 ? 's' : ''}</span>
                    {event.capacity && <span>/ {event.capacity} capacity</span>}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

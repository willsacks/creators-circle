export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { prisma } from '@cc/db'
import { redirect } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import { RsvpButton } from './rsvp-button'
import { Calendar, MapPin, Video, Users } from 'lucide-react'

const eventTypeColors: Record<string, string> = {
  workshop: 'bg-blue-100 text-blue-700',
  circle: 'bg-purple-100 text-purple-700',
  retreat: 'bg-green-100 text-green-700',
  session: 'bg-amber-100 text-amber-700',
}

export default async function ProgrammingPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const now = new Date()
  const [upcoming, past] = await Promise.all([
    prisma.programmingEvent.findMany({
      where: { startTime: { gte: now } },
      include: { rsvps: true },
      orderBy: { startTime: 'asc' },
    }),
    prisma.programmingEvent.findMany({
      where: { startTime: { lt: now } },
      include: { rsvps: true },
      orderBy: { startTime: 'desc' },
      take: 5,
    }),
  ])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold mb-2">Programming</h1>
        <p className="text-muted-foreground">Upcoming workshops, circles, and events.</p>
      </div>

      {/* Upcoming */}
      <section className="mb-10">
        <h2 className="font-serif text-xl font-bold mb-4">Upcoming Events</h2>
        {upcoming.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-2xl">
            <Calendar size={36} className="mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No upcoming events. Check back soon.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcoming.map((event) => {
              const userRsvpd = event.rsvps.some((r) => r.userId === session.user.id)
              const isFull = event.capacity !== null && event.rsvps.length >= event.capacity
              return (
                <div key={event.id} className="bg-card border border-border rounded-2xl p-6">
                  <div className="flex items-start gap-5">
                    {/* Date badge */}
                    <div className="bg-cc-gold/10 text-cc-gold-dark rounded-xl px-4 py-3 text-center shrink-0">
                      <p className="text-xs font-medium uppercase tracking-wide">
                        {new Date(event.startTime).toLocaleDateString('en-US', { month: 'short' })}
                      </p>
                      <p className="text-2xl font-bold leading-none mt-0.5">
                        {new Date(event.startTime).getDate()}
                      </p>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="font-serif text-xl font-bold">{event.title}</h3>
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${eventTypeColors[event.eventType] ?? 'bg-muted text-muted-foreground'}`}>
                          {event.eventType}
                        </span>
                      </div>

                      {event.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                          {event.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(event.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                          {' — '}
                          {new Date(event.endTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </span>
                        {event.isVirtual ? (
                          <span className="flex items-center gap-1">
                            <Video size={12} /> Virtual
                          </span>
                        ) : event.location ? (
                          <span className="flex items-center gap-1">
                            <MapPin size={12} /> {event.location}
                          </span>
                        ) : null}
                        {event.capacity && (
                          <span className="flex items-center gap-1">
                            <Users size={12} /> {event.rsvps.length}/{event.capacity} spots
                          </span>
                        )}
                      </div>
                    </div>

                    <RsvpButton
                      eventId={event.id}
                      rsvpd={userRsvpd}
                      isFull={isFull && !userRsvpd}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Past events */}
      {past.length > 0 && (
        <section>
          <h2 className="font-serif text-xl font-bold mb-4 text-muted-foreground">Past Events</h2>
          <div className="space-y-2 opacity-60">
            {past.map((event) => (
              <div key={event.id} className="bg-card border border-border rounded-xl px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(event.startTime)}</p>
                </div>
                <span className={`text-xs px-2.5 py-0.5 rounded-full ${eventTypeColors[event.eventType] ?? 'bg-muted text-muted-foreground'}`}>
                  {event.eventType}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

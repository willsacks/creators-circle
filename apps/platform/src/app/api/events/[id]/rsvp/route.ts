export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@cc/db'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const existing = await prisma.eventRsvp.findUnique({
    where: { eventId_userId: { eventId: params.id, userId: session.user.id } },
  })

  if (existing) {
    await prisma.eventRsvp.delete({
      where: { eventId_userId: { eventId: params.id, userId: session.user.id } },
    })
    return NextResponse.json({ rsvpd: false })
  }

  const event = await prisma.programmingEvent.findUnique({
    where: { id: params.id },
    include: { rsvps: true },
  })

  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  if (event.capacity !== null && event.rsvps.length >= event.capacity) {
    return NextResponse.json({ error: 'Event is full' }, { status: 409 })
  }

  await prisma.eventRsvp.create({
    data: { eventId: params.id, userId: session.user.id },
  })

  return NextResponse.json({ rsvpd: true })
}

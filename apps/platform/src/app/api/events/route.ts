export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@cc/db'

export async function GET() {
  const events = await prisma.programmingEvent.findMany({
    include: { rsvps: true },
    orderBy: { startTime: 'asc' },
  })
  return NextResponse.json(events)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const event = await prisma.programmingEvent.create({
    data: {
      title: body.title,
      description: body.description ?? null,
      startTime: new Date(body.startTime),
      endTime: new Date(body.endTime),
      isVirtual: body.isVirtual ?? false,
      meetingUrl: body.meetingUrl ?? null,
      location: body.location ?? null,
      eventType: body.eventType ?? 'workshop',
      capacity: body.capacity ?? null,
    },
  })

  return NextResponse.json(event)
}

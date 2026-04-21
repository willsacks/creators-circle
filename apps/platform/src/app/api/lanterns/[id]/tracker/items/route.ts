export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@cc/db'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const lantern = await prisma.lantern.findUnique({ where: { id: params.id } })
  if (!lantern || lantern.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const tracker = await prisma.lanternTracker.findUnique({ where: { lanternId: params.id } })
  if (!tracker) return NextResponse.json({ error: 'No tracker' }, { status: 404 })

  const items = await prisma.lanternTrackerItem.findMany({
    where: { trackerId: tracker.id },
    orderBy: { position: 'asc' },
  })

  return NextResponse.json(items)
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (session.user.plan === 'FREE') {
    return NextResponse.json({ error: 'Upgrade required' }, { status: 403 })
  }

  const lantern = await prisma.lantern.findUnique({ where: { id: params.id } })
  if (!lantern || lantern.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const tracker = await prisma.lanternTracker.findUnique({ where: { lanternId: params.id } })
  if (!tracker) return NextResponse.json({ error: 'No tracker' }, { status: 404 })

  const { title, position } = await req.json()
  if (!title) return NextResponse.json({ error: 'Missing title' }, { status: 400 })

  const maxPos = await prisma.lanternTrackerItem.aggregate({
    where: { trackerId: tracker.id },
    _max: { position: true },
  })
  const nextPosition = position ?? (maxPos._max.position ?? -1) + 1

  const item = await prisma.lanternTrackerItem.create({
    data: {
      trackerId: tracker.id,
      title,
      position: nextPosition,
      progress: 0,
    },
  })

  return NextResponse.json(item)
}

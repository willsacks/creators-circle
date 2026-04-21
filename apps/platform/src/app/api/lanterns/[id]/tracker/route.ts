export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@cc/db'

async function getOwnedLantern(lanternId: string, userId: string) {
  const lantern = await prisma.lantern.findUnique({ where: { id: lanternId } })
  if (!lantern) return null
  if (lantern.userId !== userId) return null
  return lantern
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const lantern = await getOwnedLantern(params.id, session.user.id)
  if (!lantern) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const tracker = await prisma.lanternTracker.findUnique({
    where: { lanternId: params.id },
    include: { items: { orderBy: { position: 'asc' } } },
  })

  return NextResponse.json(tracker ?? null)
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (session.user.plan === 'FREE') {
    return NextResponse.json({ error: 'Upgrade to Creator or Pro to use Lantern Trackers' }, { status: 403 })
  }

  const lantern = await getOwnedLantern(params.id, session.user.id)
  if (!lantern) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const existing = await prisma.lanternTracker.findUnique({ where: { lanternId: params.id } })
  if (existing) return NextResponse.json({ error: 'Tracker already exists' }, { status: 409 })

  const { trackerType, config } = await req.json()
  if (!trackerType) return NextResponse.json({ error: 'Missing trackerType' }, { status: 400 })

  const tracker = await prisma.lanternTracker.create({
    data: {
      lanternId: params.id,
      trackerType,
      config: JSON.stringify(config ?? {}),
    },
    include: { items: true },
  })

  return NextResponse.json(tracker)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (session.user.plan === 'FREE') {
    return NextResponse.json({ error: 'Upgrade required' }, { status: 403 })
  }

  const lantern = await getOwnedLantern(params.id, session.user.id)
  if (!lantern) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const tracker = await prisma.lanternTracker.findUnique({ where: { lanternId: params.id } })
  if (!tracker) return NextResponse.json({ error: 'No tracker found' }, { status: 404 })

  const { trackerType, config } = await req.json()

  await prisma.lanternTrackerItem.deleteMany({ where: { trackerId: tracker.id } })

  const updated = await prisma.lanternTracker.update({
    where: { id: tracker.id },
    data: {
      trackerType,
      config: JSON.stringify(config ?? {}),
    },
    include: { items: true },
  })

  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const lantern = await getOwnedLantern(params.id, session.user.id)
  if (!lantern) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.lanternTracker.deleteMany({ where: { lanternId: params.id } })

  return NextResponse.json({ success: true })
}

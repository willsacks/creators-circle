export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@cc/db'

async function resolveItem(itemId: string, lanternId: string, userId: string) {
  const lantern = await prisma.lantern.findUnique({ where: { id: lanternId } })
  if (!lantern || lantern.userId !== userId) return null

  const tracker = await prisma.lanternTracker.findUnique({ where: { lanternId } })
  if (!tracker) return null

  const item = await prisma.lanternTrackerItem.findUnique({ where: { id: itemId } })
  if (!item || item.trackerId !== tracker.id) return null

  return item
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (session.user.plan === 'FREE') {
    return NextResponse.json({ error: 'Upgrade required' }, { status: 403 })
  }

  const item = await resolveItem(params.itemId, params.id, session.user.id)
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { title, progress, notes, position } = await req.json()

  const updated = await prisma.lanternTrackerItem.update({
    where: { id: params.itemId },
    data: {
      ...(title !== undefined && { title }),
      ...(progress !== undefined && { progress: Math.max(0, Math.min(1, progress)) }),
      ...(notes !== undefined && { notes }),
      ...(position !== undefined && { position }),
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const item = await resolveItem(params.itemId, params.id, session.user.id)
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.lanternTrackerItem.delete({ where: { id: params.itemId } })

  return NextResponse.json({ success: true })
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@cc/db'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const existing = await prisma.lanternReaction.findUnique({
    where: { lanternId_userId: { lanternId: params.id, userId: session.user.id } },
  })

  if (existing) {
    await prisma.lanternReaction.delete({
      where: { lanternId_userId: { lanternId: params.id, userId: session.user.id } },
    })
    return NextResponse.json({ reacted: false })
  }

  await prisma.lanternReaction.create({
    data: { lanternId: params.id, userId: session.user.id, emoji: '🔥' },
  })
  return NextResponse.json({ reacted: true })
}

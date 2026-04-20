export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@cc/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tag = searchParams.get('tag')
  const userId = searchParams.get('userId')

  const lanterns = await prisma.lantern.findMany({
    where: {
      ...(userId ? { userId } : { visibility: 'COMMUNITY' }),
      ...(tag ? { tags: { contains: tag } } : {}),
    },
    include: {
      user: { include: { artistProfile: { select: { slug: true, artistName: true } } } },
      reactions: true,
      comments: { include: { user: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return NextResponse.json(lanterns)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, body, tags, imageUrl, visibility } = await req.json()
  if (!title || !body) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const lantern = await prisma.lantern.create({
    data: {
      userId: session.user.id,
      title,
      body,
      tags: JSON.stringify(Array.isArray(tags) ? tags : []),
      imageUrl: imageUrl ?? null,
      visibility: visibility ?? 'COMMUNITY',
    },
  })

  return NextResponse.json(lantern)
}

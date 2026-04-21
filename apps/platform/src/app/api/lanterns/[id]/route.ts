export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@cc/db'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const lantern = await prisma.lantern.findUnique({ where: { id: params.id } })
  if (!lantern) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (lantern.userId !== session.user.id && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { title, body, tags, imageUrl, visibility } = await req.json()
  const updated = await prisma.lantern.update({
    where: { id: params.id },
    data: {
      title,
      body,
      tags: JSON.stringify(tags ?? []),
      imageUrl: imageUrl || null,
      visibility,
    },
  })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const lantern = await prisma.lantern.findUnique({ where: { id: params.id } })
  if (!lantern) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (lantern.userId !== session.user.id && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.lantern.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}

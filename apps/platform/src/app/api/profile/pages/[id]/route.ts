export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@cc/db'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const page = await prisma.sitePage.findUnique({
    where: { id: params.id },
    include: { profile: true },
  })
  if (!page || page.profile.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { title, sections, published, seoTitle, seoDescription } = await req.json()

  const updated = await prisma.sitePage.update({
    where: { id: params.id },
    data: {
      ...(title !== undefined && { title }),
      ...(sections !== undefined && { sections: JSON.stringify(sections) }),
      ...(published !== undefined && { published }),
      ...(seoTitle !== undefined && { seoTitle }),
      ...(seoDescription !== undefined && { seoDescription }),
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const page = await prisma.sitePage.findUnique({
    where: { id: params.id },
    include: { profile: true },
  })
  if (!page || page.profile.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.sitePage.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}

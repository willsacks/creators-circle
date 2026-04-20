import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@cc/db'

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name } = await req.json()
  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: { name },
  })
  return NextResponse.json(updated)
}

export async function DELETE() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.user.delete({ where: { id: session.user.id } })
  return NextResponse.json({ success: true })
}

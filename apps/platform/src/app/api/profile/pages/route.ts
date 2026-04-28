export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@cc/db'
import { buildSectionsForPageType } from '@/lib/page-templates'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { profileId, title, slug, pageType } = await req.json()
  if (!profileId || !title || !slug) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const profile = await prisma.artistProfile.findUnique({ where: { id: profileId } })
  if (!profile || profile.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const resolvedType = pageType ?? 'CUSTOM'
  const sections = buildSectionsForPageType(resolvedType, profile)

  const page = await prisma.sitePage.create({
    data: {
      profileId,
      title,
      slug,
      pageType: resolvedType,
      sections: JSON.stringify(sections),
      published: false,
    },
  })

  return NextResponse.json(page)
}

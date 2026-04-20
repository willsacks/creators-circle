export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@cc/db'

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { artistName, slug, tagline, bio, siteTheme, seoTitle, seoDescription, customDomain, sitePublished, navLinks } = body

  // Check slug uniqueness if changing
  if (slug) {
    const existing = await prisma.artistProfile.findFirst({
      where: { slug, userId: { not: session.user.id } },
    })
    if (existing) return NextResponse.json({ error: 'Slug already taken' }, { status: 409 })
  }

  const profile = await prisma.artistProfile.upsert({
    where: { userId: session.user.id },
    update: {
      artistName,
      slug,
      tagline,
      bio,
      siteTheme,
      seoTitle,
      seoDescription,
      customDomain,
      sitePublished,
    },
    create: {
      userId: session.user.id,
      artistName: artistName ?? 'My Artist Site',
      slug: slug ?? session.user.id,
      siteTheme: siteTheme ?? 'sage-dark',
    },
  })

  if (navLinks && Array.isArray(navLinks)) {
    await prisma.navLink.deleteMany({ where: { profileId: profile.id } })
    if (navLinks.length > 0) {
      await prisma.navLink.createMany({
        data: navLinks.map((l: { label: string; url: string; order: number; openInNew: boolean }, i: number) => ({
          profileId: profile.id,
          label: l.label,
          url: l.url,
          order: l.order ?? i,
          openInNew: l.openInNew ?? false,
        })),
      })
    }
  }

  return NextResponse.json(profile)
}

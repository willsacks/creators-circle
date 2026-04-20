import { prisma } from '@cc/db'
import { notFound } from 'next/navigation'
import { getTheme } from '@/lib/themes'
import { SectionRenderer } from '@/components/section-renderer'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: { artistSlug: string; pageSlug: string }
}): Promise<Metadata> {
  const profile = await prisma.artistProfile.findUnique({ where: { slug: params.artistSlug } })
  const page = await prisma.sitePage.findFirst({
    where: { profile: { slug: params.artistSlug }, slug: params.pageSlug },
  })
  return {
    title: page?.seoTitle ?? `${page?.title} — ${profile?.artistName}`,
    description: page?.seoDescription ?? '',
  }
}

export async function generateStaticParams() {
  const pages = await prisma.sitePage.findMany({
    where: { published: true },
    include: { profile: { select: { slug: true } } },
  })
  return pages.map((p) => ({ artistSlug: p.profile.slug, pageSlug: p.slug }))
}

export default async function ArtistSubPage({
  params,
}: {
  params: { artistSlug: string; pageSlug: string }
}) {
  const profile = await prisma.artistProfile.findUnique({
    where: { slug: params.artistSlug },
  })

  if (!profile || !profile.sitePublished) notFound()

  const page = await prisma.sitePage.findFirst({
    where: { profile: { slug: params.artistSlug }, slug: params.pageSlug, published: true },
  })

  if (!page) notFound()

  const theme = getTheme(profile.siteTheme)
  const sections = JSON.parse(page.sections || '[]')

  return (
    <>
      {sections.map((section: { id: string; type: string; settings: Record<string, unknown> }) => (
        <SectionRenderer key={section.id} section={section} theme={theme} />
      ))}
    </>
  )
}

export const revalidate = 60

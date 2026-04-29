import { prisma } from '@cc/db'
import { notFound } from 'next/navigation'
import { getTheme } from '@/lib/themes'
import { SectionRenderer } from '@/components/section-renderer'
import { SiteNav } from '@/components/site-nav'

export const dynamic = 'force-dynamic'

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: { artistSlug: string; pageSlug: string }
  searchParams: { token?: string }
}) {
  if (searchParams.token !== process.env.PREVIEW_SECRET) notFound()

  const profile = await prisma.artistProfile.findUnique({
    where: { slug: params.artistSlug },
    include: { navLinks: { orderBy: { order: 'asc' } } },
  })

  if (!profile) notFound()

  const page = await prisma.sitePage.findFirst({
    where: { profile: { slug: params.artistSlug }, slug: params.pageSlug },
  })

  if (!page) notFound()

  const theme = getTheme(profile.siteTheme)
  const sections = JSON.parse(page.sections || '[]')
  const socialLinks = profile.socialLinks ? JSON.parse(profile.socialLinks) : {}

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, fontFamily: theme.fontBody, minHeight: '100vh' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, backgroundColor: '#1a1a1a', color: '#fff', fontSize: '0.75rem', padding: '6px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ backgroundColor: '#f59e0b', color: '#000', padding: '2px 8px', borderRadius: '3px', fontWeight: 600 }}>DRAFT PREVIEW</span>
        <span style={{ opacity: 0.7 }}>{page.title} — not published</span>
      </div>
      <div style={{ paddingTop: '32px' }}>
        <SiteNav
          artistName={profile.artistName}
          artistSlug={profile.slug}
          navLinks={profile.navLinks}
          theme={theme}
          socialLinks={socialLinks}
        />
        <main>
          {sections.map((section: { id: string; type: string; settings: Record<string, unknown> }) => (
            <SectionRenderer key={section.id} section={section} theme={theme} />
          ))}
        </main>
      </div>
    </div>
  )
}

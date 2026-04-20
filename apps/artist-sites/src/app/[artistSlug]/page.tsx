import { prisma } from '@cc/db'
import { notFound } from 'next/navigation'
import { getTheme } from '@/lib/themes'
import { SectionRenderer } from '@/components/section-renderer'

export default async function ArtistHomePage({ params }: { params: { artistSlug: string } }) {
  const profile = await prisma.artistProfile.findUnique({
    where: { slug: params.artistSlug },
    include: {
      pages: {
        where: { pageType: 'HOME', published: true },
        take: 1,
      },
    },
  })

  if (!profile || !profile.sitePublished) notFound()

  const homePage = profile.pages[0]
  const theme = getTheme(profile.siteTheme)

  if (!homePage) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '48px 24px' }}>
        <div>
          <h1 style={{ fontFamily: theme.fontHeading, fontSize: '3rem', color: theme.text, marginBottom: '16px' }}>
            {profile.artistName}
          </h1>
          {profile.tagline && (
            <p style={{ color: theme.muted, fontSize: '1.25rem' }}>{profile.tagline}</p>
          )}
        </div>
      </div>
    )
  }

  const sections = JSON.parse(homePage.sections || '[]')

  return (
    <>
      {sections.map((section: { id: string; type: string; settings: Record<string, unknown> }) => (
        <SectionRenderer key={section.id} section={section} theme={theme} />
      ))}
    </>
  )
}

export const revalidate = 60

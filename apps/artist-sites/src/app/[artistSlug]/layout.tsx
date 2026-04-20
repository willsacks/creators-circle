import { prisma } from '@cc/db'
import { notFound } from 'next/navigation'
import { getTheme } from '@/lib/themes'
import { SiteNav } from '@/components/site-nav'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: { artistSlug: string }
}): Promise<Metadata> {
  const profile = await prisma.artistProfile.findUnique({
    where: { slug: params.artistSlug },
  })
  return {
    title: profile?.seoTitle ?? profile?.artistName ?? 'Artist Site',
    description: profile?.seoDescription ?? profile?.tagline ?? '',
  }
}

export default async function ArtistLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { artistSlug: string }
}) {
  const profile = await prisma.artistProfile.findUnique({
    where: { slug: params.artistSlug },
    include: { navLinks: { orderBy: { order: 'asc' } } },
  })

  if (!profile || !profile.sitePublished) notFound()

  const theme = getTheme(profile.siteTheme)
  const socialLinks = profile.socialLinks ? JSON.parse(profile.socialLinks) : {}

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, fontFamily: theme.fontBody, minHeight: '100vh' }}>
      <SiteNav
        artistName={profile.artistName}
        artistSlug={profile.slug}
        navLinks={profile.navLinks}
        theme={theme}
        socialLinks={socialLinks}
      />
      <main>{children}</main>
      <footer style={{ backgroundColor: theme.surface, borderTop: `1px solid ${theme.muted}30` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px', textAlign: 'center' }}>
          <p style={{ fontFamily: theme.fontHeading, fontSize: '1.25rem', color: theme.text, marginBottom: '8px' }}>
            {profile.artistName}
          </p>
          {profile.tagline && (
            <p style={{ color: theme.muted, fontSize: '0.875rem' }}>{profile.tagline}</p>
          )}
          <p style={{ color: theme.muted, fontSize: '0.75rem', marginTop: '24px' }}>
            © {new Date().getFullYear()} {profile.artistName}. Built with{' '}
            <a href="http://localhost:3000" style={{ color: theme.accent }}>Creators Circle</a>.
          </p>
        </div>
      </footer>
    </div>
  )
}

export const revalidate = 60

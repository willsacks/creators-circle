export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { prisma } from '@cc/db'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Globe, Settings, LayoutList, Plus, ExternalLink } from 'lucide-react'

export default async function SiteDashboardPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const profile = await prisma.artistProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      pages: { orderBy: { order: 'asc' } },
      navLinks: { orderBy: { order: 'asc' } },
    },
  })

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <Globe size={48} className="mx-auto text-cc-gold mb-6" />
        <h1 className="font-serif text-3xl mb-4">Set Up Your Artist Site</h1>
        <p className="text-muted-foreground mb-8">
          Create your artist profile to start building your public site.
        </p>
        <Link
          href="/dashboard/site/settings"
          className="bg-cc-gold text-white px-6 py-3 rounded-xl font-medium hover:bg-cc-gold-dark transition-colors"
        >
          Create Profile →
        </Link>
      </div>
    )
  }

  const publishedPages = profile.pages.filter((p) => p.published).length

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold mb-1">{profile.artistName}</h1>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${profile.sitePublished ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${profile.sitePublished ? 'bg-green-500' : 'bg-stone-400'}`} />
              {profile.sitePublished ? 'Published' : 'Draft'}
            </span>
            <span className="text-sm text-muted-foreground">/{profile.slug}</span>
            {profile.sitePublished && (
              <a
                href={`${process.env.NEXT_PUBLIC_ARTIST_SITES_URL ?? 'http://localhost:3001'}/${profile.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-cc-gold hover:underline"
              >
                View site <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/site/settings"
            className="flex items-center gap-2 border border-border px-4 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
          >
            <Settings size={15} /> Settings
          </Link>
          <Link
            href="/dashboard/site/pages"
            className="flex items-center gap-2 bg-cc-gold text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cc-gold-dark transition-colors"
          >
            <LayoutList size={15} /> Manage Pages
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-2xl font-bold">{profile.pages.length}</p>
          <p className="text-sm text-muted-foreground">Total pages</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-2xl font-bold">{publishedPages}</p>
          <p className="text-sm text-muted-foreground">Published</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-2xl font-bold">{profile.navLinks.length}</p>
          <p className="text-sm text-muted-foreground">Nav links</p>
        </div>
      </div>

      {/* Pages preview */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-bold">Pages</h2>
          <Link
            href="/dashboard/site/pages"
            className="flex items-center gap-1.5 text-sm text-cc-gold hover:underline"
          >
            <Plus size={14} /> New Page
          </Link>
        </div>
        {profile.pages.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-4">No pages yet.</p>
            <Link
              href="/dashboard/site/pages"
              className="bg-cc-gold text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Create Your First Page
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {profile.pages.map((page) => (
              <div
                key={page.id}
                className="flex items-center justify-between py-3 px-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-0.5 rounded bg-card border border-border text-muted-foreground">
                    {page.pageType}
                  </span>
                  <span className="font-medium text-sm">{page.title}</span>
                  <span className="text-xs text-muted-foreground">/{page.slug}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${page.published ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                    {page.published ? 'Published' : 'Draft'}
                  </span>
                  <Link
                    href={`/dashboard/site/pages/${page.id}`}
                    className="text-xs text-cc-gold hover:underline"
                  >
                    Edit →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

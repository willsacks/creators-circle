import { auth } from '@/lib/auth'
import { prisma } from '@cc/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PageType } from '@cc/db'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { NewPageButton } from './new-page-button'
import { DeletePageButton } from './delete-page-button'

const pageTypeColors: Record<PageType, string> = {
  HOME: 'bg-blue-100 text-blue-700',
  BIO: 'bg-purple-100 text-purple-700',
  MUSIC: 'bg-pink-100 text-pink-700',
  OFFERINGS: 'bg-amber-100 text-amber-700',
  CONTACT: 'bg-green-100 text-green-700',
  CUSTOM: 'bg-stone-100 text-stone-700',
  LANDING: 'bg-indigo-100 text-indigo-700',
}

export default async function PagesListPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const profile = await prisma.artistProfile.findUnique({
    where: { userId: session.user.id },
    include: { pages: { orderBy: { order: 'asc' } } },
  })

  if (!profile) redirect('/dashboard/site/settings')

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold">Pages</h1>
          <p className="text-muted-foreground mt-1">Manage the pages on your artist site.</p>
        </div>
        <NewPageButton profileId={profile.id} />
      </div>

      {profile.pages.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-border">
          <p className="text-4xl mb-4">📄</p>
          <h2 className="font-serif text-2xl mb-3">No pages yet</h2>
          <p className="text-muted-foreground mb-6">Create your first page to start building your site.</p>
          <NewPageButton profileId={profile.id} />
        </div>
      ) : (
        <div className="space-y-3">
          {profile.pages.map((page) => (
            <div
              key={page.id}
              className="bg-card border border-border rounded-xl p-5 flex items-center justify-between hover:border-cc-gold/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${pageTypeColors[page.pageType as PageType]}`}>
                  {page.pageType}
                </span>
                <div>
                  <p className="font-semibold text-foreground">{page.title}</p>
                  <p className="text-xs text-muted-foreground">/{page.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2.5 py-1 rounded-full ${page.published ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                  {page.published ? '● Published' : '○ Draft'}
                </span>
                <Link
                  href={`/dashboard/site/pages/${page.id}`}
                  className="flex items-center gap-1.5 text-sm font-medium text-cc-gold hover:underline"
                >
                  <Edit2 size={14} /> Edit
                </Link>
                <DeletePageButton pageId={page.id} pageTitle={page.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

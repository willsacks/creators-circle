export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { prisma } from '@cc/db'
import { redirect, notFound } from 'next/navigation'
import { formatRelativeTime } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { LanternTrackerSection } from './lantern-tracker-section'

export default async function LanternDetailPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const lantern = await prisma.lantern.findUnique({
    where: { id: params.id },
    include: { user: true, reactions: true, comments: { include: { user: true } } },
  })

  if (!lantern) notFound()

  const isOwner = lantern.userId === session.user.id
  const tags = JSON.parse(lantern.tags || '[]') as string[]

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/dashboard/lanterns"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft size={15} />
        My Lanterns
      </Link>

      {/* Lantern content */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden mb-8">
        {lantern.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={lantern.imageUrl} alt={lantern.title} className="w-full max-h-72 object-cover" />
        )}
        <div className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-serif text-2xl font-bold">{lantern.title}</h1>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    lantern.visibility === 'COMMUNITY'
                      ? 'bg-cc-gold/10 text-cc-gold-dark'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {lantern.visibility}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{formatRelativeTime(lantern.createdAt)}</p>
            </div>
          </div>

          <p className="text-sm leading-relaxed whitespace-pre-wrap mb-4">{lantern.body}</p>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {tags.map((tag) => (
                <span key={tag} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-3 border-t border-border">
            <span>🔥 {lantern.reactions.length}</span>
            <span>💬 {lantern.comments.length}</span>
          </div>
        </div>
      </div>

      {/* Lantern Tracker — owner only */}
      {isOwner && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-border" />
            <h2 className="font-serif text-lg font-semibold text-muted-foreground whitespace-nowrap">
              🔦 Lantern Tracker
            </h2>
            <div className="flex-1 h-px bg-border" />
          </div>
          <LanternTrackerSection
            lanternId={params.id}
            userPlan={session.user.plan}
          />
        </div>
      )}
    </div>
  )
}

import { auth } from '@/lib/auth'
import { prisma } from '@cc/db'
import { redirect } from 'next/navigation'
import { formatRelativeTime } from '@/lib/utils'
import { LanternReactionButton } from '@/components/dashboard/lantern-reaction'

export default async function CommunityPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const lanterns = await prisma.lantern.findMany({
    where: { visibility: 'COMMUNITY' },
    include: {
      user: { include: { artistProfile: { select: { slug: true, artistName: true } } } },
      reactions: true,
      comments: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold mb-2">Community</h1>
        <p className="text-muted-foreground">Lanterns from across Creators Circle.</p>
      </div>

      <div className="columns-1 md:columns-2 gap-4 space-y-0">
        {lanterns.map((lantern) => {
          const tags = JSON.parse(lantern.tags || '[]') as string[]
          const reactionCount = lantern.reactions.length
          const userReacted = lantern.reactions.some((r) => r.userId === session.user.id)
          const name = lantern.user.artistProfile?.artistName ?? lantern.user.name ?? 'Artist'
          const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

          return (
            <div
              key={lantern.id}
              className="break-inside-avoid mb-4 bg-card border border-border rounded-2xl p-5 hover:border-cc-gold/30 transition-colors"
            >
              {/* Author */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-cc-gold/20 flex items-center justify-center text-cc-gold font-semibold text-sm shrink-0">
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{name}</p>
                  <p className="text-xs text-muted-foreground">{formatRelativeTime(lantern.createdAt)}</p>
                </div>
              </div>

              {/* Content */}
              <h3 className="font-serif text-lg font-bold mb-2">{lantern.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{lantern.body}</p>

              {/* Image */}
              {lantern.imageUrl && (
                <div
                  className="mt-3 h-40 rounded-xl bg-stone-200"
                  style={{ backgroundImage: `url(${lantern.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                />
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {tags.map((tag) => (
                    <span key={tag} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
                <LanternReactionButton
                  lanternId={lantern.id}
                  count={reactionCount}
                  userReacted={userReacted}
                />
                <span className="text-xs text-muted-foreground">
                  {lantern.comments.length} comment{lantern.comments.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {lanterns.length === 0 && (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🏮</p>
          <h2 className="font-serif text-2xl mb-3">No lanterns yet</h2>
          <p className="text-muted-foreground">Be the first to share something with the community.</p>
        </div>
      )}
    </div>
  )
}

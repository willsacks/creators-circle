export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { prisma } from '@cc/db'
import { redirect } from 'next/navigation'
import { formatRelativeTime } from '@/lib/utils'
import { CreateLanternButton } from './create-lantern-button'
import { DeleteLanternButton } from './delete-lantern-button'
import { Edit2 } from 'lucide-react'

export default async function LanternsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const lanterns = await prisma.lantern.findMany({
    where: { userId: session.user.id },
    include: { reactions: true, comments: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold mb-1">My Lanterns</h1>
          <p className="text-muted-foreground">Share your process, projects, and reflections.</p>
        </div>
        <CreateLanternButton />
      </div>

      {lanterns.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-2xl">
          <p className="text-5xl mb-4">🏮</p>
          <h2 className="font-serif text-2xl mb-3">Light your first Lantern</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Share what you're working on, reflect on your process, or celebrate a win with the community.
          </p>
          <CreateLanternButton />
        </div>
      ) : (
        <div className="space-y-4">
          {lanterns.map((lantern) => {
            const tags = JSON.parse(lantern.tags || '[]') as string[]
            return (
              <div key={lantern.id} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-serif text-lg font-bold truncate">{lantern.title}</h3>
                      <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full ${lantern.visibility === 'COMMUNITY' ? 'bg-cc-gold/10 text-cc-gold-dark' : 'bg-muted text-muted-foreground'}`}>
                        {lantern.visibility}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{lantern.body}</p>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {tags.map((tag) => (
                          <span key={tag} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                      <span>{formatRelativeTime(lantern.createdAt)}</span>
                      <span>🔥 {lantern.reactions.length}</span>
                      <span>💬 {lantern.comments.length}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <DeleteLanternButton lanternId={lantern.id} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

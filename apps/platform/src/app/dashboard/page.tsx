export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { prisma } from '@cc/db'
import Link from 'next/link'
import { Globe, Flame, Calendar, ArrowRight } from 'lucide-react'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) return null

  const [profile, lanternCount, upcomingEvents] = await Promise.all([
    prisma.artistProfile.findUnique({
      where: { userId: session.user.id },
      include: { pages: { where: { published: true } } },
    }),
    prisma.lantern.count({ where: { userId: session.user.id } }),
    prisma.programmingEvent.findMany({
      where: { startTime: { gte: new Date() } },
      orderBy: { startTime: 'asc' },
      take: 3,
    }),
  ])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = session.user.name?.split(' ')[0] ?? 'Artist'

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="font-serif text-4xl text-foreground mb-2">
          {greeting}, {firstName}.
        </h1>
        <p className="text-muted-foreground">Here's what's happening in your world.</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-card rounded-2xl p-6 border border-border">
          <Globe size={22} className="text-cc-gold mb-3" />
          <p className="text-2xl font-bold text-foreground mb-0.5">
            {profile?.pages.length ?? 0}
          </p>
          <p className="text-sm text-muted-foreground">Published pages</p>
        </div>
        <div className="bg-card rounded-2xl p-6 border border-border">
          <Flame size={22} className="text-cc-gold mb-3" />
          <p className="text-2xl font-bold text-foreground mb-0.5">{lanternCount}</p>
          <p className="text-sm text-muted-foreground">Lanterns posted</p>
        </div>
        <div className="bg-card rounded-2xl p-6 border border-border">
          <Calendar size={22} className="text-cc-gold mb-3" />
          <p className="text-2xl font-bold text-foreground mb-0.5">{upcomingEvents.length}</p>
          <p className="text-sm text-muted-foreground">Upcoming events</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Site status */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-bold">Your Site</h2>
            <Link href="/dashboard/site" className="text-sm text-cc-gold hover:underline flex items-center gap-1">
              Manage <ArrowRight size={14} />
            </Link>
          </div>
          {profile ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${profile.sitePublished ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${profile.sitePublished ? 'bg-green-500' : 'bg-stone-400'}`} />
                  {profile.sitePublished ? 'Published' : 'Draft'}
                </span>
              </div>
              <p className="font-medium text-foreground">{profile.artistName}</p>
              <p className="text-sm text-muted-foreground">/{profile.slug}</p>
            </div>
          ) : (
            <div>
              <p className="text-muted-foreground text-sm mb-4">You haven't set up your site yet.</p>
              <Link
                href="/dashboard/site"
                className="inline-flex items-center gap-2 bg-cc-gold text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cc-gold-dark transition-colors"
              >
                Set Up Site →
              </Link>
            </div>
          )}
        </div>

        {/* Upcoming events */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-bold">Upcoming Events</h2>
            <Link href="/dashboard/programming" className="text-sm text-cc-gold hover:underline flex items-center gap-1">
              All events <ArrowRight size={14} />
            </Link>
          </div>
          {upcomingEvents.length === 0 ? (
            <p className="text-muted-foreground text-sm">No upcoming events.</p>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-3">
                  <div className="bg-cc-gold/10 text-cc-gold-dark rounded-lg px-2.5 py-1.5 text-center min-w-[44px]">
                    <p className="text-xs font-medium uppercase">
                      {new Date(event.startTime).toLocaleDateString('en-US', { month: 'short' })}
                    </p>
                    <p className="text-lg font-bold leading-none">
                      {new Date(event.startTime).getDate()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.isVirtual ? 'Virtual' : event.location ?? 'Location TBD'} ·{' '}
                      {new Date(event.startTime).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6 bg-cc-dark rounded-2xl p-6 text-white">
        <h2 className="font-serif text-xl mb-4">Quick actions</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <Link
            href="/dashboard/lanterns"
            className="bg-white/10 hover:bg-white/20 rounded-xl px-4 py-3 text-sm font-medium transition-colors text-center"
          >
            ✍️ Post a Lantern
          </Link>
          <Link
            href="/dashboard/site/pages"
            className="bg-white/10 hover:bg-white/20 rounded-xl px-4 py-3 text-sm font-medium transition-colors text-center"
          >
            📄 Add a Page
          </Link>
          <Link
            href="/dashboard/community"
            className="bg-white/10 hover:bg-white/20 rounded-xl px-4 py-3 text-sm font-medium transition-colors text-center"
          >
            👥 Browse Community
          </Link>
        </div>
      </div>
    </div>
  )
}

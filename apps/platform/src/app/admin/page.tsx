export const dynamic = 'force-dynamic'

import { prisma } from '@cc/db'
import Link from 'next/link'
import { Users, Globe, Flame, Calendar, TrendingUp } from 'lucide-react'

export default async function AdminOverview() {
  const [totalUsers, activeSubscribers, totalLanterns, upcomingEvents, recentSignups] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { plan: { in: ['CREATOR', 'PRO'] } } }),
      prisma.lantern.count(),
      prisma.programmingEvent.count({ where: { startTime: { gte: new Date() } } }),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { artistProfile: { select: { slug: true, artistName: true } } },
      }),
    ])

  const stats = [
    { label: 'Total Artists', value: totalUsers, icon: Users, href: '/admin/artists' },
    { label: 'Active Subscribers', value: activeSubscribers, icon: TrendingUp, href: '/admin/artists' },
    { label: 'Total Lanterns', value: totalLanterns, icon: Flame, href: '/dashboard/community' },
    { label: 'Upcoming Events', value: upcomingEvents, icon: Calendar, href: '/admin/events' },
  ]

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold mb-1">Admin Overview</h1>
        <p className="text-muted-foreground">Platform health at a glance.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} href={stat.href} className="bg-card border border-border rounded-2xl p-5 hover:border-cc-gold/50 transition-colors">
              <Icon size={22} className="text-cc-gold mb-3" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </Link>
          )
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-bold">Recent Signups</h2>
            <Link href="/admin/artists" className="text-sm text-cc-gold hover:underline">View all →</Link>
          </div>
          <div className="space-y-3">
            {recentSignups.map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cc-gold/20 flex items-center justify-center text-cc-gold text-xs font-semibold shrink-0">
                  {(user.name ?? user.email)?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name ?? user.email}</p>
                  <p className="text-xs text-muted-foreground">{user.plan}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  user.plan === 'PRO' ? 'bg-amber-100 text-amber-700' :
                  user.plan === 'CREATOR' ? 'bg-cc-gold/10 text-cc-gold-dark' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {user.plan}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-serif text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link href="/admin/artists" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors">
              <Users size={18} className="text-cc-gold" />
              <span className="text-sm font-medium">Manage Artists</span>
            </Link>
            <Link href="/admin/events" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors">
              <Calendar size={18} className="text-cc-gold" />
              <span className="text-sm font-medium">Create / Edit Events</span>
            </Link>
            <Link href="/dashboard/community" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors">
              <Flame size={18} className="text-cc-gold" />
              <span className="text-sm font-medium">View All Lanterns</span>
            </Link>
            <Link href="http://localhost:5555" target="_blank" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors">
              <Globe size={18} className="text-cc-gold" />
              <span className="text-sm font-medium">Prisma Studio</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

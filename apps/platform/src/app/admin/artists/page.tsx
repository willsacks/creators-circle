import { prisma } from '@cc/db'
import { formatDate } from '@/lib/utils'

export default async function AdminArtistsPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      artistProfile: { select: { slug: true, artistName: true, sitePublished: true, pages: { select: { id: true } } } },
    },
  })

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold mb-1">Artists</h1>
        <p className="text-muted-foreground">{users.length} total members</p>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Name</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Email</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Plan</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Role</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Site</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3 font-medium">{user.name ?? '—'}</td>
                <td className="px-5 py-3 text-muted-foreground">{user.email}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                    user.plan === 'PRO' ? 'bg-amber-100 text-amber-700' :
                    user.plan === 'CREATOR' ? 'bg-cc-gold/10 text-cc-gold-dark' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {user.plan}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                    user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-5 py-3">
                  {user.artistProfile ? (
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${user.artistProfile.sitePublished ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                        {user.artistProfile.sitePublished ? 'Live' : 'Draft'}
                      </span>
                      <a
                        href={`http://localhost:3001/${user.artistProfile.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-cc-gold hover:underline"
                      >
                        /{user.artistProfile.slug}
                      </a>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs">No site</span>
                  )}
                </td>
                <td className="px-5 py-3 text-muted-foreground text-xs">{formatDate(user.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

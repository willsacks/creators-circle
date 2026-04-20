import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/dashboard/sidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        user={{
          name: session.user.name,
          email: session.user.email,
          avatarUrl: session.user.avatarUrl,
          role: session.user.role,
          plan: session.user.plan,
        }}
      />
      <main className="lg:pl-60 min-h-screen">
        <div className="p-6 lg:p-8 pt-16 lg:pt-8">{children}</div>
      </main>
    </div>
  )
}

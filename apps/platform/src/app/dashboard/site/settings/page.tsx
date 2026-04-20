import { auth } from '@/lib/auth'
import { prisma } from '@cc/db'
import { redirect } from 'next/navigation'
import { SiteSettingsClient } from './site-settings-client'

export default async function SiteSettingsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const profile = await prisma.artistProfile.findUnique({
    where: { userId: session.user.id },
    include: { navLinks: { orderBy: { order: 'asc' } } },
  })

  return <SiteSettingsClient profile={profile} />
}

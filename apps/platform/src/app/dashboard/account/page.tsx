import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AccountClient } from './account-client'

export default async function AccountPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  return (
    <AccountClient
      user={{
        id: session.user.id,
        name: session.user.name ?? '',
        email: session.user.email ?? '',
        avatarUrl: session.user.avatarUrl,
        plan: session.user.plan,
      }}
    />
  )
}

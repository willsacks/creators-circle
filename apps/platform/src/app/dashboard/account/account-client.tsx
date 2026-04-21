'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { signOut } from 'next-auth/react'
import { MediaUpload } from '@/components/ui/media-upload'

interface AccountClientProps {
  user: {
    id: string
    name: string
    email: string
    avatarUrl?: string | null
    plan: string
  }
}

export function AccountClient({ user }: AccountClientProps) {
  const [name, setName] = useState(user.name)
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl ?? '')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const router = useRouter()

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/profile/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, avatarUrl }),
      })
      if (!res.ok) throw new Error()
      toast.success('Account updated!')
      router.refresh()
    } catch {
      toast.error('Failed to update account')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteAccount() {
    if (deleteConfirm !== 'DELETE') return
    setDeleting(true)
    try {
      const res = await fetch('/api/profile/account', { method: 'DELETE' })
      if (!res.ok) throw new Error()
      await signOut({ callbackUrl: '/' })
    } catch {
      toast.error('Failed to delete account')
      setDeleting(false)
    }
  }

  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || '?'

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold mb-1">Account</h1>
        <p className="text-muted-foreground">Manage your profile and account settings.</p>
      </div>

      {/* Profile */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <h2 className="font-serif text-xl font-bold mb-5">Profile</h2>
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-cc-gold/20 flex items-center justify-center text-cc-gold text-xl font-bold shrink-0">
            {avatarUrl
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
              : initials}
          </div>
          <div>
            <p className="font-medium">{user.name || 'No name set'}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="space-y-4">
          <MediaUpload
            label="Profile Picture"
            value={avatarUrl}
            onChange={setAvatarUrl}
            accept="image"
          />
          <div>
            <label className="block text-sm font-medium mb-1.5">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-cc-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-muted text-sm text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-cc-gold text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-cc-gold-dark disabled:opacity-60 transition-colors"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Plan */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <h2 className="font-serif text-xl font-bold mb-3">Current Plan</h2>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">{user.plan}</span>
          <a href="/dashboard/billing" className="text-sm text-cc-gold hover:underline">
            Manage billing →
          </a>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-card border border-red-200 rounded-2xl p-6">
        <h2 className="font-serif text-xl font-bold text-red-700 mb-3">Danger Zone</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Permanently delete your account. This action cannot be undone.
        </p>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1.5">Type DELETE to confirm</label>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="DELETE"
              className="w-full px-4 py-2.5 rounded-lg border border-red-200 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
          <button
            onClick={handleDeleteAccount}
            disabled={deleting || deleteConfirm !== 'DELETE'}
            className="bg-red-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-40 transition-colors"
          >
            {deleting ? 'Deleting...' : 'Delete My Account'}
          </button>
        </div>
      </div>
    </div>
  )
}

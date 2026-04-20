'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

interface NewPageButtonProps {
  profileId: string
}

export function NewPageButton({ profileId }: NewPageButtonProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [pageType, setPageType] = useState('CUSTOM')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const pageTypes = ['HOME', 'BIO', 'MUSIC', 'OFFERINGS', 'CONTACT', 'LANDING', 'CUSTOM']

  async function handleCreate() {
    if (!title || !slug) return
    setLoading(true)
    try {
      const res = await fetch('/api/profile/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId, title, slug, pageType }),
      })
      if (!res.ok) throw new Error('Failed to create page')
      const page = await res.json()
      toast.success('Page created!')
      setOpen(false)
      router.push(`/dashboard/site/pages/${page.id}`)
      router.refresh()
    } catch {
      toast.error('Failed to create page')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-cc-gold text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cc-gold-dark transition-colors"
      >
        <Plus size={15} /> New Page
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6">
            <h2 className="font-serif text-2xl font-bold mb-6">New Page</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Page Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value)
                    setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
                  }}
                  placeholder="e.g. About Me"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-cc-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">URL Slug</label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="about-me"
                    className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-cc-gold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Page Type</label>
                <select
                  value={pageType}
                  onChange={(e) => setPageType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-cc-gold"
                >
                  {pageTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 py-2.5 border border-border rounded-lg text-sm hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={loading || !title || !slug}
                className="flex-1 py-2.5 bg-cc-gold text-white rounded-lg text-sm font-medium hover:bg-cc-gold-dark disabled:opacity-60 transition-colors"
              >
                {loading ? 'Creating...' : 'Create Page'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

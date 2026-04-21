'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { MediaUpload } from '@/components/ui/media-upload'

export function CreateLanternButton() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [tags, setTags] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [visibility, setVisibility] = useState('COMMUNITY')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleCreate() {
    if (!title || !body) return
    setLoading(true)
    try {
      const res = await fetch('/api/lanterns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          body,
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
          imageUrl: imageUrl || undefined,
          visibility,
        }),
      })
      if (!res.ok) throw new Error()
      toast.success('Lantern posted!')
      setOpen(false)
      setTitle('')
      setBody('')
      setTags('')
      setImageUrl('')
      router.refresh()
    } catch {
      toast.error('Failed to post lantern')
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
        <Plus size={15} /> New Lantern
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="font-serif text-2xl font-bold mb-6">New Lantern 🏮</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What are you sharing?"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-cc-gold text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Body</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Share your thoughts, process, updates..."
                  rows={5}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-cc-gold text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="music, process, studio"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-cc-gold text-sm"
                />
              </div>
              <MediaUpload
                label="Image (optional)"
                value={imageUrl}
                onChange={setImageUrl}
                accept="image"
              />
              <div>
                <label className="block text-sm font-medium mb-1.5">Visibility</label>
                <div className="flex gap-3">
                  {['COMMUNITY', 'PRIVATE'].map((v) => (
                    <button
                      key={v}
                      onClick={() => setVisibility(v)}
                      className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${visibility === v ? 'border-cc-gold bg-cc-gold/10 text-cc-gold-dark' : 'border-border hover:bg-muted'}`}
                    >
                      {v === 'COMMUNITY' ? '👥 Community' : '🔒 Private'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setOpen(false)} className="flex-1 py-2.5 border border-border rounded-lg text-sm hover:bg-muted transition-colors">
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={loading || !title || !body}
                className="flex-1 py-2.5 bg-cc-gold text-white rounded-lg text-sm font-medium hover:bg-cc-gold-dark disabled:opacity-60 transition-colors"
              >
                {loading ? 'Posting...' : 'Post Lantern 🏮'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

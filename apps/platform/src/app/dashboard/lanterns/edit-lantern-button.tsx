'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { MediaUpload } from '@/components/ui/media-upload'

interface EditLanternButtonProps {
  lantern: {
    id: string
    title: string
    body: string
    tags: string
    imageUrl: string | null
    visibility: string
  }
}

export function EditLanternButton({ lantern }: EditLanternButtonProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(lantern.title)
  const [body, setBody] = useState(lantern.body)
  const [tags, setTags] = useState(() => {
    try { return (JSON.parse(lantern.tags) as string[]).join(', ') } catch { return '' }
  })
  const [imageUrl, setImageUrl] = useState(lantern.imageUrl ?? '')
  const [visibility, setVisibility] = useState(lantern.visibility)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSave() {
    if (!title || !body) return
    setLoading(true)
    try {
      const res = await fetch(`/api/lanterns/${lantern.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          body,
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
          imageUrl: imageUrl || null,
          visibility,
        }),
      })
      if (!res.ok) throw new Error()
      toast.success('Lantern updated!')
      setOpen(false)
      router.refresh()
    } catch {
      toast.error('Failed to update lantern')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
        title="Edit lantern"
      >
        <Pencil size={15} />
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="font-serif text-2xl font-bold mb-6">Edit Lantern 🏮</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-cc-gold text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Body</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
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
                onClick={handleSave}
                disabled={loading || !title || !body}
                className="flex-1 py-2.5 bg-cc-gold text-white rounded-lg text-sm font-medium hover:bg-cc-gold-dark disabled:opacity-60 transition-colors"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

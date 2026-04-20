'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export function DeletePageButton({ pageId, pageTitle }: { pageId: string; pageTitle: string }) {
  const [confirming, setConfirming] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    try {
      await fetch(`/api/profile/pages/${pageId}`, { method: 'DELETE' })
      toast.success('Page deleted')
      router.refresh()
    } catch {
      toast.error('Failed to delete page')
    }
    setConfirming(false)
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Delete "{pageTitle}"?</span>
        <button onClick={handleDelete} className="text-xs text-red-600 font-medium hover:underline">
          Yes
        </button>
        <button onClick={() => setConfirming(false)} className="text-xs text-muted-foreground hover:underline">
          No
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-muted-foreground hover:text-destructive transition-colors"
    >
      <Trash2 size={14} />
    </button>
  )
}

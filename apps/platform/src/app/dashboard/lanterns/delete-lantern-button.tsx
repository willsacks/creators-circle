'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export function DeleteLanternButton({ lanternId }: { lanternId: string }) {
  const [confirming, setConfirming] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    try {
      const res = await fetch(`/api/lanterns/${lanternId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Lantern deleted')
      router.refresh()
    } catch {
      toast.error('Failed to delete')
    }
    setConfirming(false)
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="text-muted-foreground">Delete?</span>
        <button onClick={handleDelete} className="text-red-600 font-medium hover:underline">Yes</button>
        <button onClick={() => setConfirming(false)} className="text-muted-foreground hover:underline">No</button>
      </div>
    )
  }

  return (
    <button onClick={() => setConfirming(true)} className="text-muted-foreground hover:text-destructive transition-colors p-1.5">
      <Trash2 size={15} />
    </button>
  )
}

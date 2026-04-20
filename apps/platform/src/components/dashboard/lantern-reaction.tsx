'use client'

import { useState } from 'react'
import { toast } from 'sonner'

interface LanternReactionButtonProps {
  lanternId: string
  count: number
  userReacted: boolean
}

export function LanternReactionButton({ lanternId, count, userReacted }: LanternReactionButtonProps) {
  const [reacted, setReacted] = useState(userReacted)
  const [total, setTotal] = useState(count)

  async function toggleReaction() {
    const prev = reacted
    setReacted(!prev)
    setTotal(prev ? total - 1 : total + 1)
    try {
      await fetch(`/api/lanterns/${lanternId}/react`, { method: 'POST' })
    } catch {
      setReacted(prev)
      setTotal(total)
      toast.error('Failed to react')
    }
  }

  return (
    <button
      onClick={toggleReaction}
      className={`flex items-center gap-1.5 text-xs font-medium transition-all ${
        reacted ? 'text-orange-500' : 'text-muted-foreground hover:text-orange-400'
      }`}
    >
      <span className="text-base">{reacted ? '🔥' : '🔥'}</span>
      <span>{total}</span>
    </button>
  )
}

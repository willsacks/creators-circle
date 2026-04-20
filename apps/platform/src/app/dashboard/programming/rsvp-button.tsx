'use client'

import { useState } from 'react'
import { toast } from 'sonner'

export function RsvpButton({
  eventId,
  rsvpd,
  isFull,
}: {
  eventId: string
  rsvpd: boolean
  isFull: boolean
}) {
  const [currentRsvpd, setCurrentRsvpd] = useState(rsvpd)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    setLoading(true)
    try {
      const res = await fetch(`/api/events/${eventId}/rsvp`, { method: 'POST' })
      if (!res.ok) throw new Error()
      setCurrentRsvpd(!currentRsvpd)
      toast.success(currentRsvpd ? 'RSVP cancelled' : 'You\'re registered!')
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (isFull) {
    return (
      <button className="shrink-0 text-xs px-4 py-2 rounded-lg border border-border text-muted-foreground cursor-not-allowed">
        Full
      </button>
    )
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`shrink-0 text-sm px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-60 ${
        currentRsvpd
          ? 'border border-border bg-muted text-foreground hover:bg-red-50 hover:text-red-600 hover:border-red-200'
          : 'bg-cc-gold text-white hover:bg-cc-gold-dark'
      }`}
    >
      {loading ? '...' : currentRsvpd ? 'Cancel RSVP' : 'RSVP →'}
    </button>
  )
}

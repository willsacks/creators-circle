'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

export function CreateEventButton() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    isVirtual: true,
    meetingUrl: '',
    location: '',
    eventType: 'workshop',
    capacity: '',
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function set(key: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleCreate() {
    setLoading(true)
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          capacity: form.capacity ? parseInt(form.capacity) : null,
        }),
      })
      if (!res.ok) throw new Error()
      toast.success('Event created!')
      setOpen(false)
      router.refresh()
    } catch {
      toast.error('Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="flex items-center gap-2 bg-cc-gold text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cc-gold-dark transition-colors">
        <Plus size={15} /> New Event
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="font-serif text-2xl font-bold mb-6">New Event</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Title</label>
                <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-cc-gold" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Description</label>
                <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-cc-gold resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Start Time</label>
                  <input type="datetime-local" value={form.startTime} onChange={(e) => set('startTime', e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-cc-gold" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">End Time</label>
                  <input type="datetime-local" value={form.endTime} onChange={(e) => set('endTime', e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-cc-gold" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Event Type</label>
                <select value={form.eventType} onChange={(e) => set('eventType', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-cc-gold">
                  {['workshop', 'circle', 'retreat', 'session'].map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Virtual Event</label>
                <button
                  onClick={() => set('isVirtual', !form.isVirtual)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${form.isVirtual ? 'bg-cc-gold' : 'bg-muted'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.isVirtual ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              {form.isVirtual ? (
                <div>
                  <label className="block text-sm font-medium mb-1.5">Meeting URL</label>
                  <input type="url" value={form.meetingUrl} onChange={(e) => set('meetingUrl', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-cc-gold" />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-1.5">Location</label>
                  <input type="text" value={form.location} onChange={(e) => set('location', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-cc-gold" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1.5">Capacity (optional)</label>
                <input type="number" value={form.capacity} onChange={(e) => set('capacity', e.target.value)} placeholder="Leave blank for unlimited" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-cc-gold" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setOpen(false)} className="flex-1 py-2.5 border border-border rounded-lg text-sm hover:bg-muted transition-colors">Cancel</button>
              <button onClick={handleCreate} disabled={loading || !form.title || !form.startTime} className="flex-1 py-2.5 bg-cc-gold text-white rounded-lg text-sm font-medium hover:bg-cc-gold-dark disabled:opacity-60 transition-colors">
                {loading ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

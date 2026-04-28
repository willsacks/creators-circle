'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Music, Ticket, BookOpen, Palette, Sliders, Plus, Minus, X } from 'lucide-react'
import { TRACKER_TYPES, TrackerType } from '@/lib/tracker-types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ICONS: Record<string, React.ComponentType<any>> = {
  Music,
  Ticket,
  BookOpen,
  Palette,
  Sliders,
}

interface TrackerSetupProps {
  lanternId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onCreated: (tracker: any) => void
}

export function TrackerSetup({ lanternId, onCreated }: TrackerSetupProps) {
  const [creating, setCreating] = useState(false)
  const [customOpen, setCustomOpen] = useState(false)
  const [customStages, setCustomStages] = useState(['Stage 1', 'Stage 2', 'Stage 3', 'Done'])

  async function create(trackerType: TrackerType, config: Record<string, unknown> = {}) {
    setCreating(true)
    try {
      const res = await fetch(`/api/lanterns/${lanternId}/tracker`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackerType, config }),
      })
      if (!res.ok) {
        const err = await res.json()
        toast.error(err.error ?? 'Failed to create tracker')
        return
      }
      const tracker = await res.json()
      toast.success('Tracker lit 🔦')
      onCreated(tracker)
    } finally {
      setCreating(false)
    }
  }

  function handleSelect(type: TrackerType) {
    if (type === 'custom') {
      setCustomOpen(true)
      return
    }
    create(type)
  }

  function addStage() {
    if (customStages.length >= 8) return
    setCustomStages([...customStages, `Stage ${customStages.length + 1}`])
  }

  function removeStage(i: number) {
    if (customStages.length <= 2) return
    setCustomStages(customStages.filter((_, idx) => idx !== i))
  }

  function updateStage(i: number, value: string) {
    const next = [...customStages]
    next[i] = value
    setCustomStages(next)
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {TRACKER_TYPES.map((type) => {
          const Icon = ICONS[type.icon] ?? Sliders
          return (
            <button
              key={type.id}
              onClick={() => handleSelect(type.id)}
              disabled={creating}
              className="text-left bg-card border border-border rounded-xl p-4 hover:border-cc-gold hover:bg-cc-gold/5 transition-colors disabled:opacity-50 group"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-cc-gold/10 flex items-center justify-center text-cc-gold group-hover:bg-cc-gold/20 transition-colors">
                  <Icon size={16} />
                </div>
                <span className="font-medium text-sm">{type.label}</span>
              </div>
              <p className="text-xs text-muted-foreground">{type.description}</p>
            </button>
          )
        })}
      </div>

      {customOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif text-lg font-bold">Define your stages</h3>
              <button
                onClick={() => setCustomOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              {customStages.map((stage, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-5 text-right shrink-0">{i + 1}</span>
                  <input
                    type="text"
                    value={stage}
                    onChange={(e) => updateStage(i, e.target.value)}
                    className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-cc-gold"
                  />
                  <button
                    onClick={() => removeStage(i)}
                    disabled={customStages.length <= 2}
                    className="text-muted-foreground hover:text-destructive disabled:opacity-30"
                  >
                    <Minus size={14} />
                  </button>
                </div>
              ))}
            </div>

            {customStages.length < 8 && (
              <button
                onClick={addStage}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-cc-gold transition-colors mb-5"
              >
                <Plus size={14} />
                Add stage
              </button>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCustomOpen(false)}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setCustomOpen(false)
                  create('custom', { stages: customStages.filter(Boolean) })
                }}
                disabled={creating || customStages.filter(Boolean).length < 2}
                className="bg-cc-gold text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-cc-gold-dark disabled:opacity-50"
              >
                Create tracker
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

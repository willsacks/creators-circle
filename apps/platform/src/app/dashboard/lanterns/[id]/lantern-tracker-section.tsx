'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { TrackerSetup } from '@/components/dashboard/tracker/tracker-setup'
import { SliderTracker } from '@/components/dashboard/tracker/slider-tracker'
import { getTrackerDef } from '@/lib/tracker-types'

interface TrackerItem {
  id: string
  title: string
  position: number
  progress: number
  notes?: string | null
}

interface Tracker {
  id: string
  trackerType: string
  config: string
  items: TrackerItem[]
}

interface LanternTrackerSectionProps {
  lanternId: string
  userPlan: string
}

export function LanternTrackerSection({ lanternId, userPlan }: LanternTrackerSectionProps) {
  const [tracker, setTracker] = useState<Tracker | null | undefined>(undefined)
  const [resetting, setResetting] = useState(false)

  useEffect(() => {
    fetch(`/api/lanterns/${lanternId}/tracker`)
      .then((r) => r.json())
      .then(setTracker)
      .catch(() => setTracker(null))
  }, [lanternId])

  async function handleReset() {
    setResetting(true)
    try {
      const res = await fetch(`/api/lanterns/${lanternId}/tracker`, { method: 'DELETE' })
      if (!res.ok) {
        toast.error('Failed to reset tracker')
        return
      }
      setTracker(null)
      toast.success('Tracker reset')
    } finally {
      setResetting(false)
    }
  }

  if (userPlan === 'FREE') {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-card/80 backdrop-blur-[2px] flex flex-col items-center justify-center z-10 rounded-2xl">
          <p className="text-2xl mb-3">🔦</p>
          <h3 className="font-serif text-base font-semibold mb-1">Unlock Lantern Trackers</h3>
          <p className="text-sm text-muted-foreground text-center max-w-xs mb-4">
            Track your projects as you light the way — upgrade to Creator or Pro.
          </p>
          <a
            href="/dashboard/billing"
            className="bg-cc-gold text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-cc-gold-dark transition-colors"
          >
            Upgrade plan
          </a>
        </div>
        {/* Blurred preview */}
        <TrackerPreview />
      </div>
    )
  }

  if (tracker === undefined) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="h-24 flex items-center justify-center">
          <div className="w-5 h-5 rounded-full border-2 border-cc-gold border-t-transparent animate-spin" />
        </div>
      </div>
    )
  }

  if (tracker === null || resetting) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6">
        <p className="text-sm text-muted-foreground mb-4">
          Choose a tracker type to manage your project stages.
        </p>
        <TrackerSetup lanternId={lanternId} onCreated={setTracker} />
      </div>
    )
  }

  const config = (() => {
    try { return JSON.parse(tracker.config) } catch { return {} }
  })()
  const def = getTrackerDef(tracker.trackerType, config)

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-xs text-muted-foreground uppercase tracking-wide">{def.label}</span>
        </div>
      </div>
      <SliderTracker
        lanternId={lanternId}
        trackerId={tracker.id}
        trackerType={tracker.trackerType}
        initialItems={tracker.items}
        stages={def.stages}
        itemLabel={def.itemLabel}
        itemPlaceholder={def.itemPlaceholder}
        onReset={handleReset}
      />
    </div>
  )
}

function TrackerPreview() {
  return (
    <div className="opacity-30 pointer-events-none select-none">
      <div className="mb-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>3 of 8 songs complete</span>
          <span>38%</span>
        </div>
        <div className="h-1 bg-border rounded-full">
          <div className="h-full bg-cc-gold rounded-full w-[38%]" />
        </div>
      </div>
      {['Opening Track', 'Verse Bloom', 'Night Ritual', 'Gold Meridian'].map((title, i) => (
        <div key={i} className="flex items-center gap-3 py-2">
          <span className="text-xs text-muted-foreground w-4 text-right">{i + 1}</span>
          <span className="w-36 text-sm truncate">{title}</span>
          <div className="flex-1 relative h-5 flex items-center">
            <div className="absolute inset-x-0 h-px bg-border" />
            <div
              className="absolute left-0 h-0.5 bg-cc-gold"
              style={{ width: `${[100, 62, 25, 0][i]}%` }}
            />
            <div
              className="absolute w-3.5 h-3.5 rounded-full bg-cc-gold border-2 border-white shadow-sm -translate-x-1/2"
              style={{ left: `${[100, 62, 25, 0][i]}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

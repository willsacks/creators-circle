'use client'

interface TrackerHeaderProps {
  itemLabel: string
  items: { progress: number }[]
}

export function TrackerHeader({ itemLabel, items }: TrackerHeaderProps) {
  const total = items.length
  const complete = items.filter((i) => i.progress >= 1).length
  const overallProgress = total === 0 ? 0 : items.reduce((sum, i) => sum + i.progress, 0) / total

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-muted-foreground">
          {complete} of {total} {itemLabel}{total !== 1 ? 's' : ''} complete
        </span>
        <span className="text-xs font-medium text-cc-gold">{Math.round(overallProgress * 100)}%</span>
      </div>
      <div className="h-1 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-cc-gold rounded-full transition-all duration-300"
          style={{ width: `${overallProgress * 100}%` }}
        />
      </div>
    </div>
  )
}

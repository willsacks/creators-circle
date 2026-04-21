'use client'

import { useState, useRef, useCallback } from 'react'
import { toast } from 'sonner'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TrackerHeader } from './tracker-header'

interface TrackerItem {
  id: string
  title: string
  position: number
  progress: number
  notes?: string | null
}

interface SliderTrackerProps {
  lanternId: string
  trackerId: string
  trackerType: string
  initialItems: TrackerItem[]
  stages: string[]
  itemLabel: string
  itemPlaceholder: string
  onReset: () => void
}

export function SliderTracker({
  lanternId,
  trackerId,
  trackerType,
  initialItems,
  stages,
  itemLabel,
  itemPlaceholder,
  onReset,
}: SliderTrackerProps) {
  const [items, setItems] = useState<TrackerItem[]>(initialItems)
  const [addingItem, setAddingItem] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [resetConfirm, setResetConfirm] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const patchItem = useCallback(
    async (itemId: string, data: Partial<Pick<TrackerItem, 'title' | 'progress' | 'notes' | 'position'>>) => {
      const res = await fetch(`/api/lanterns/${lanternId}/tracker/items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) toast.error('Failed to save')
    },
    [lanternId]
  )

  async function addItem() {
    const title = newTitle.trim()
    if (!title) return
    setAddingItem(true)
    try {
      const res = await fetch(`/api/lanterns/${lanternId}/tracker/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })
      if (!res.ok) {
        toast.error('Failed to add item')
        return
      }
      const item = await res.json()
      setItems((prev) => [...prev, item])
      setNewTitle('')
    } finally {
      setAddingItem(false)
    }
  }

  async function deleteItem(itemId: string) {
    setItems((prev) => prev.filter((i) => i.id !== itemId))
    const res = await fetch(`/api/lanterns/${lanternId}/tracker/items/${itemId}`, {
      method: 'DELETE',
    })
    if (!res.ok) {
      toast.error('Failed to delete item')
    }
  }

  function handleProgressChange(itemId: string, progress: number) {
    setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, progress } : i)))
  }

  async function handleProgressCommit(itemId: string, progress: number) {
    setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, progress } : i)))
    await patchItem(itemId, { progress })
  }

  async function handleTitleSave(itemId: string, title: string) {
    setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, title } : i)))
    await patchItem(itemId, { title })
  }

  async function handleSnapAll(stageIndex: number) {
    const progress = stageIndex / (stages.length - 1)
    const stageName = stages[stageIndex]
    setItems((prev) => prev.map((i) => ({ ...i, progress })))
    await Promise.all(items.map((i) => patchItem(i.id, { progress })))
    toast.success(`All ${itemLabel}s moved to "${stageName}"`)
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex((i) => i.id === active.id)
    const newIndex = items.findIndex((i) => i.id === over.id)
    const reordered = arrayMove(items, oldIndex, newIndex).map((item, idx) => ({
      ...item,
      position: idx,
    }))
    setItems(reordered)
    await Promise.all(reordered.map((i) => patchItem(i.id, { position: i.position })))
  }

  return (
    <div>
      <TrackerHeader itemLabel={itemLabel} items={items} />

      {/* Stage headers */}
      <div className="flex pl-[13.5rem] pr-2 mb-2">
        <div className="flex-1 flex justify-between">
          {stages.map((stage, i) => (
            <button
              key={i}
              onClick={() => handleSnapAll(i)}
              title={`Move all ${itemLabel}s to "${stage}"`}
              className="text-[10px] text-muted-foreground hover:text-cc-gold transition-colors leading-tight max-w-[4rem] text-center"
            >
              {stage}
            </button>
          ))}
        </div>
      </div>

      {/* Item rows */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-1">
            {items.map((item, index) => (
              <SortableItemRow
                key={item.id}
                item={item}
                index={index}
                stages={stages}
                lanternId={lanternId}
                onProgressChange={handleProgressChange}
                onProgressCommit={handleProgressCommit}
                onTitleSave={handleTitleSave}
                onDelete={deleteItem}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add item */}
      <div className="mt-3 flex items-center gap-2 pl-[13.5rem]">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
          placeholder={itemPlaceholder}
          className="flex-1 bg-transparent border-b border-border text-sm py-1 focus:outline-none focus:border-cc-gold placeholder:text-muted-foreground"
        />
        <button
          onClick={addItem}
          disabled={addingItem || !newTitle.trim()}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-cc-gold disabled:opacity-40 transition-colors"
        >
          <Plus size={14} />
          Add {itemLabel}
        </button>
      </div>

      {/* Change type */}
      <div className="mt-5 pt-4 border-t border-border flex justify-end">
        {resetConfirm ? (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">This will delete all {itemLabel}s. Sure?</span>
            <button
              onClick={() => setResetConfirm(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              onClick={onReset}
              className="text-destructive hover:underline font-medium"
            >
              Yes, reset
            </button>
          </div>
        ) : (
          <button
            onClick={() => setResetConfirm(true)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Change tracker type
          </button>
        )}
      </div>
    </div>
  )
}

interface SortableItemRowProps {
  item: TrackerItem
  index: number
  stages: string[]
  lanternId: string
  onProgressChange: (id: string, progress: number) => void
  onProgressCommit: (id: string, progress: number) => Promise<void>
  onTitleSave: (id: string, title: string) => Promise<void>
  onDelete: (id: string) => void
}

function SortableItemRow({
  item,
  index,
  stages,
  onProgressChange,
  onProgressCommit,
  onTitleSave,
  onDelete,
}: SortableItemRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  })
  const style = { transform: CSS.Transform.toString(transform), transition }

  const trackRef = useRef<HTMLDivElement>(null)
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState(item.title)
  const isDraggingGem = useRef(false)

  function getProgressFromPointer(clientX: number): number {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect) return item.progress
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  }

  function snapToStage(progress: number): number {
    return Math.round(progress * (stages.length - 1)) / (stages.length - 1)
  }

  function handleTrackPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId)
    isDraggingGem.current = true
    const p = getProgressFromPointer(e.clientX)
    onProgressChange(item.id, p)
  }

  function handleTrackPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDraggingGem.current) return
    onProgressChange(item.id, getProgressFromPointer(e.clientX))
  }

  function handleTrackPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDraggingGem.current) return
    isDraggingGem.current = false
    const snapped = snapToStage(getProgressFromPointer(e.clientX))
    onProgressCommit(item.id, snapped)
  }

  async function commitTitle() {
    setEditingTitle(false)
    const trimmed = titleValue.trim()
    if (!trimmed || trimmed === item.title) return
    await onTitleSave(item.id, trimmed)
  }

  const stageIndex = Math.round(item.progress * (stages.length - 1))
  const currentStage = stages[stageIndex] ?? stages[stages.length - 1]

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 group py-1.5 ${isDragging ? 'opacity-50' : ''}`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing shrink-0"
      >
        <GripVertical size={14} />
      </button>

      {/* Index */}
      <span className="text-muted-foreground text-xs w-4 text-right shrink-0 select-none">
        {index + 1}
      </span>

      {/* Title */}
      <div className="w-36 shrink-0">
        {editingTitle ? (
          <input
            type="text"
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={(e) => e.key === 'Enter' && commitTitle()}
            autoFocus
            className="w-full bg-transparent border-b border-cc-gold text-sm focus:outline-none"
          />
        ) : (
          <button
            onClick={() => setEditingTitle(true)}
            className="text-sm text-left w-full truncate hover:text-cc-gold transition-colors"
            title={item.title}
          >
            {item.title}
          </button>
        )}
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        className="flex-1 relative h-5 flex items-center cursor-pointer select-none"
        onPointerDown={handleTrackPointerDown}
        onPointerMove={handleTrackPointerMove}
        onPointerUp={handleTrackPointerUp}
      >
        {/* Background line */}
        <div className="absolute inset-x-0 h-px bg-border" />
        {/* Filled line */}
        <div
          className="absolute left-0 h-0.5 bg-cc-gold transition-none"
          style={{ width: `${item.progress * 100}%` }}
        />
        {/* Gem */}
        <div
          className="absolute w-3.5 h-3.5 rounded-full bg-cc-gold border-2 border-white shadow-sm -translate-x-1/2 transition-none z-10"
          style={{ left: `${item.progress * 100}%` }}
        />
        {/* Stage tick marks */}
        {stages.map((_, i) => {
          const pos = (i / (stages.length - 1)) * 100
          return (
            <div
              key={i}
              className="absolute w-px h-2 bg-border -translate-x-1/2"
              style={{ left: `${pos}%` }}
            />
          )
        })}
      </div>

      {/* Current stage label */}
      <span className="text-xs text-muted-foreground w-20 shrink-0 truncate hidden sm:block">
        {currentStage}
      </span>

      {/* Delete */}
      <button
        onClick={() => onDelete(item.id)}
        className="text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition-all shrink-0"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}

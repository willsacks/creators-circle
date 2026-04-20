'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Save, Eye, Globe, ChevronLeft, Plus, Settings2, GripVertical, Trash2, X } from 'lucide-react'
import Link from 'next/link'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { SectionPreview } from './section-preview'
import { SectionSettingsPanel } from './section-settings'
import { v4 as uuidv4 } from 'uuid'

export type Section = {
  id: string
  type: string
  settings: Record<string, unknown>
}

const SECTION_TYPES = [
  { type: 'hero-fullwidth', label: 'Full-screen Hero', icon: '🌅' },
  { type: 'hero-split', label: 'Split Hero', icon: '◧' },
  { type: 'text-centered', label: 'Centered Text', icon: '≡' },
  { type: 'text-two-column', label: 'Two Column Text', icon: '⊟' },
  { type: 'gallery-masonry', label: 'Masonry Gallery', icon: '⊞' },
  { type: 'gallery-slider', label: 'Image Slider', icon: '▷' },
  { type: 'offering-card-grid', label: 'Offering Cards', icon: '🎁' },
  { type: 'offering-hero', label: 'Offering Hero', icon: '⭐' },
  { type: 'music-embed', label: 'Music Embed', icon: '🎵' },
  { type: 'video-embed', label: 'Video Embed', icon: '▶' },
  { type: 'testimonial-quotes', label: 'Testimonials', icon: '💬' },
  { type: 'cta-banner', label: 'CTA Banner', icon: '📣' },
  { type: 'email-signup', label: 'Email Signup', icon: '✉' },
  { type: 'social-links', label: 'Social Links', icon: '🔗' },
  { type: 'contact-form', label: 'Contact Form', icon: '📝' },
  { type: 'events-list', label: 'Events List', icon: '📅' },
  { type: 'divider', label: 'Divider', icon: '—' },
]

function defaultSettingsForType(type: string): Record<string, unknown> {
  const defaults: Record<string, Record<string, unknown>> = {
    'hero-fullwidth': { headline: 'Your Headline', subheadline: 'Your subheadline', ctaText: 'Get Started', ctaUrl: '#', overlayOpacity: 0.5, textColor: '#ffffff' },
    'hero-split': { headline: 'Your Headline', subheadline: '', imagePosition: 'right' },
    'text-centered': { content: '<p>Your content here...</p>', maxWidth: 'md' },
    'text-two-column': { leftContent: '<p>Left column content...</p>', rightContent: '<p>Right column content...</p>' },
    'gallery-masonry': { images: [], columns: 3, showCaptions: false },
    'gallery-slider': { images: [], showCaptions: true },
    'offering-card-grid': { offerings: [] },
    'offering-hero': { title: 'Your Offering', description: 'Describe what you offer', ctaText: 'Learn More', ctaUrl: '#', overlayOpacity: 0.6 },
    'music-embed': { embedUrl: '', title: 'Music' },
    'video-embed': { embedUrl: '', title: 'Video' },
    'testimonial-quotes': { quotes: [{ text: 'Quote here', author: 'Name', title: 'Title' }] },
    'cta-banner': { headline: 'Ready to begin?', ctaText: 'Get Started', ctaUrl: '#', backgroundColor: '#1A1815', textColor: '#F5F0E8', accentColor: '#C4892A' },
    'email-signup': { headline: 'Join the list', buttonText: 'Subscribe', placeholder: 'Your email' },
    'social-links': { links: [] },
    'contact-form': { submitText: 'Send', successMessage: 'Thank you!' },
    'events-list': {},
    'divider': { height: 'md' },
  }
  return defaults[type] ?? {}
}

function SortableSection({
  section,
  isSelected,
  onSelect,
  onDelete,
}: {
  section: Section
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative border-2 rounded-xl overflow-hidden cursor-pointer transition-colors ${
        isSelected ? 'border-cc-gold' : 'border-transparent hover:border-cc-gold/40'
      }`}
      onClick={onSelect}
    >
      <SectionPreview section={section} />
      <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          {...attributes}
          {...listeners}
          className="p-1.5 bg-white/90 rounded-lg shadow text-stone-600 hover:text-cc-gold cursor-grab active:cursor-grabbing"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical size={14} />
        </button>
        <button
          className="p-1.5 bg-white/90 rounded-lg shadow text-stone-600 hover:text-red-600"
          onClick={(e) => { e.stopPropagation(); onDelete() }}
        >
          <Trash2 size={14} />
        </button>
      </div>
      {isSelected && (
        <div className="absolute top-2 right-2">
          <span className="text-xs bg-cc-gold text-white px-2 py-0.5 rounded-full font-medium">
            Selected
          </span>
        </div>
      )}
    </div>
  )
}

interface PageEditorProps {
  page: {
    id: string
    title: string
    slug: string
    published: boolean
    sections: Section[]
    seoTitle: string
    seoDescription: string
  }
  profileSlug: string
}

export function PageEditor({ page, profileSlug }: PageEditorProps) {
  const [sections, setSections] = useState<Section[]>(page.sections)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [title, setTitle] = useState(page.title)
  const [published, setPublished] = useState(page.published)
  const [saving, setSaving] = useState(false)
  const [showSectionPicker, setShowSectionPicker] = useState(false)
  const router = useRouter()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const selectedSection = sections.find((s) => s.id === selectedId) ?? null

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  function addSection(type: string) {
    const newSection: Section = {
      id: uuidv4(),
      type,
      settings: defaultSettingsForType(type),
    }
    setSections((prev) => [...prev, newSection])
    setSelectedId(newSection.id)
    setShowSectionPicker(false)
  }

  function deleteSection(id: string) {
    setSections((prev) => prev.filter((s) => s.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  function updateSectionSettings(id: string, settings: Record<string, unknown>) {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, settings: { ...s.settings, ...settings } } : s))
    )
  }

  async function handleSave(publish?: boolean) {
    setSaving(true)
    try {
      const res = await fetch(`/api/profile/pages/${page.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          sections,
          published: publish !== undefined ? publish : published,
        }),
      })
      if (!res.ok) throw new Error()
      if (publish !== undefined) setPublished(publish)
      toast.success(publish ? 'Page published!' : 'Page saved!')
      router.refresh()
    } catch {
      toast.error('Failed to save page')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/site/pages"
            className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <ChevronLeft size={18} />
          </Link>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="font-serif text-lg font-bold bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-cc-gold rounded px-1"
          />
          <span className={`text-xs px-2 py-0.5 rounded-full ${published ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
            {published ? 'Published' : 'Draft'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`http://localhost:3001/${profileSlug}/${page.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <Eye size={15} /> Preview
          </a>
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="flex items-center gap-1.5 border border-border px-3 py-1.5 rounded-lg text-sm hover:bg-muted transition-colors disabled:opacity-60"
          >
            <Save size={15} /> {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={() => handleSave(!published)}
            disabled={saving}
            className="flex items-center gap-1.5 bg-cc-gold text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-cc-gold-dark transition-colors disabled:opacity-60"
          >
            <Globe size={15} /> {published ? 'Unpublish' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Section picker */}
        <div className="w-56 border-r border-border bg-card flex flex-col shrink-0 overflow-hidden">
          <div className="p-3 border-b border-border">
            <button
              onClick={() => setShowSectionPicker(!showSectionPicker)}
              className="w-full flex items-center justify-center gap-2 bg-cc-gold text-white py-2 rounded-lg text-sm font-medium hover:bg-cc-gold-dark transition-colors"
            >
              <Plus size={15} /> Add Section
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {showSectionPicker && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground px-2 py-1">Select section type</p>
                {SECTION_TYPES.map((s) => (
                  <button
                    key={s.type}
                    onClick={() => addSection(s.type)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors text-left"
                  >
                    <span className="text-base">{s.icon}</span>
                    <span className="text-xs font-medium">{s.label}</span>
                  </button>
                ))}
              </div>
            )}
            {!showSectionPicker && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground px-2 py-1">Sections ({sections.length})</p>
                {sections.map((s) => {
                  const sType = SECTION_TYPES.find((t) => t.type === s.type)
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedId(s.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                        selectedId === s.id ? 'bg-cc-gold/10 text-cc-gold-dark' : 'hover:bg-muted'
                      }`}
                    >
                      <span className="text-base">{sType?.icon ?? '□'}</span>
                      <span className="text-xs font-medium truncate">{sType?.label ?? s.type}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Center: Canvas */}
        <div className="flex-1 overflow-y-auto bg-stone-100 p-4">
          <div className="bg-white rounded-xl shadow-sm min-h-full overflow-hidden">
            {sections.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-4xl mb-4">✦</p>
                <p className="text-muted-foreground font-medium">No sections yet</p>
                <p className="text-sm text-muted-foreground mt-1">Click "Add Section" to start building</p>
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-1">
                    {sections.map((section) => (
                      <SortableSection
                        key={section.id}
                        section={section}
                        isSelected={selectedId === section.id}
                        onSelect={() => setSelectedId(section.id)}
                        onDelete={() => deleteSection(section.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>

        {/* Right: Settings */}
        <div className="w-72 border-l border-border bg-card flex flex-col shrink-0 overflow-hidden">
          {selectedSection ? (
            <>
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Settings2 size={15} className="text-muted-foreground" />
                  <span className="text-sm font-medium">Section Settings</span>
                </div>
                <button onClick={() => setSelectedId(null)} className="text-muted-foreground hover:text-foreground">
                  <X size={15} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <SectionSettingsPanel
                  section={selectedSection}
                  onChange={(settings) => updateSectionSettings(selectedSection.id, settings)}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center px-6">
              <div>
                <Settings2 size={32} className="mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">Select a section to edit its settings</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

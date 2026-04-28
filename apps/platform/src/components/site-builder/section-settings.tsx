'use client'

import { Section } from './page-editor'
import { MediaUpload } from '@/components/ui/media-upload'
import { FocalPointPicker } from '@/components/ui/focal-point-picker'

interface SectionSettingsPanelProps {
  section: Section
  onChange: (settings: Record<string, unknown>) => void
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-4 py-3 border-b border-border last:border-0">
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-cc-gold"
    />
  )
}

function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-cc-gold resize-none"
    />
  )
}

function SliderInput({
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.05,
  label,
}: {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
}) {
  return (
    <div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-cc-gold"
      />
      {label && <span className="text-xs text-muted-foreground">{label}: {value}</span>}
    </div>
  )
}

export function SectionSettingsPanel({ section, onChange }: SectionSettingsPanelProps) {
  const s = section.settings

  function set(key: string, value: unknown) {
    onChange({ [key]: value })
  }

  switch (section.type) {
    case 'hero-fullwidth':
      return (
        <div>
          <Field label="Background Image">
            <MediaUpload value={(s.backgroundImage as string) ?? ''} onChange={(v) => set('backgroundImage', v)} accept="image" />
            {s.backgroundImage && (
              <FocalPointPicker
                imageUrl={s.backgroundImage as string}
                focalX={(s.focalX as number) ?? 50}
                focalY={(s.focalY as number) ?? 50}
                onChange={(x, y) => onChange({ focalX: x, focalY: y })}
              />
            )}
          </Field>
          <Field label="Headline">
            <TextInput value={(s.headline as string) ?? ''} onChange={(v) => set('headline', v)} placeholder="Your headline" />
          </Field>
          <Field label="Subheadline">
            <TextInput value={(s.subheadline as string) ?? ''} onChange={(v) => set('subheadline', v)} placeholder="Subheadline text" />
          </Field>
          <Field label="CTA Button Text">
            <TextInput value={(s.ctaText as string) ?? ''} onChange={(v) => set('ctaText', v)} placeholder="Get Started" />
          </Field>
          <Field label="CTA Button URL">
            <TextInput value={(s.ctaUrl as string) ?? ''} onChange={(v) => set('ctaUrl', v)} placeholder="/page or #anchor" />
          </Field>
          <Field label={`Overlay Opacity: ${((s.overlayOpacity as number) ?? 0.5).toFixed(2)}`}>
            <SliderInput value={(s.overlayOpacity as number) ?? 0.5} onChange={(v) => set('overlayOpacity', v)} />
          </Field>
          <Field label="Text Color">
            <input type="color" value={(s.textColor as string) ?? '#ffffff'} onChange={(e) => set('textColor', e.target.value)} className="w-full h-8 rounded cursor-pointer" />
          </Field>
        </div>
      )

    case 'hero-split':
      return (
        <div>
          <Field label="Image">
            <MediaUpload value={(s.image as string) ?? ''} onChange={(v) => set('image', v)} accept="image" />
            {s.image && (
              <FocalPointPicker
                imageUrl={s.image as string}
                focalX={(s.focalX as number) ?? 50}
                focalY={(s.focalY as number) ?? 50}
                onChange={(x, y) => onChange({ focalX: x, focalY: y })}
              />
            )}
          </Field>
          <Field label="Headline">
            <TextInput value={(s.headline as string) ?? ''} onChange={(v) => set('headline', v)} />
          </Field>
          <Field label="Subheadline">
            <TextInput value={(s.subheadline as string) ?? ''} onChange={(v) => set('subheadline', v)} />
          </Field>
          <Field label="Image Position">
            <select value={(s.imagePosition as string) ?? 'right'} onChange={(e) => set('imagePosition', e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background">
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </Field>
        </div>
      )

    case 'text-centered':
      return (
        <div>
          <Field label="Content (HTML)">
            <TextArea value={(s.content as string) ?? ''} onChange={(v) => set('content', v)} placeholder="<p>Your content...</p>" rows={6} />
          </Field>
          <Field label="Max Width">
            <select value={(s.maxWidth as string) ?? 'md'} onChange={(e) => set('maxWidth', e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background">
              <option value="sm">Narrow</option>
              <option value="md">Medium</option>
              <option value="lg">Wide</option>
              <option value="xl">Full</option>
            </select>
          </Field>
        </div>
      )

    case 'text-two-column':
      return (
        <div>
          <Field label="Left Column (HTML)">
            <TextArea value={(s.leftContent as string) ?? ''} onChange={(v) => set('leftContent', v)} rows={5} />
          </Field>
          <Field label="Right Column (HTML)">
            <TextArea value={(s.rightContent as string) ?? ''} onChange={(v) => set('rightContent', v)} rows={5} />
          </Field>
        </div>
      )

    case 'offering-hero':
      return (
        <div>
          <Field label="Background Image">
            <MediaUpload value={(s.backgroundImage as string) ?? ''} onChange={(v) => set('backgroundImage', v)} accept="image" />
            {s.backgroundImage && (
              <FocalPointPicker
                imageUrl={s.backgroundImage as string}
                focalX={(s.focalX as number) ?? 50}
                focalY={(s.focalY as number) ?? 50}
                onChange={(x, y) => onChange({ focalX: x, focalY: y })}
              />
            )}
          </Field>
          <Field label="Title">
            <TextInput value={(s.title as string) ?? ''} onChange={(v) => set('title', v)} />
          </Field>
          <Field label="Description">
            <TextArea value={(s.description as string) ?? ''} onChange={(v) => set('description', v)} />
          </Field>
          <Field label="CTA Text">
            <TextInput value={(s.ctaText as string) ?? ''} onChange={(v) => set('ctaText', v)} />
          </Field>
          <Field label="CTA URL">
            <TextInput value={(s.ctaUrl as string) ?? ''} onChange={(v) => set('ctaUrl', v)} />
          </Field>
          <Field label={`Overlay: ${((s.overlayOpacity as number) ?? 0.6).toFixed(2)}`}>
            <SliderInput value={(s.overlayOpacity as number) ?? 0.6} onChange={(v) => set('overlayOpacity', v)} />
          </Field>
        </div>
      )

    case 'music-embed':
      return (
        <div>
          <Field label="Title">
            <TextInput value={(s.title as string) ?? ''} onChange={(v) => set('title', v)} />
          </Field>
          <Field label="Embed URL (Spotify, SoundCloud, etc.)">
            <TextInput value={(s.embedUrl as string) ?? ''} onChange={(v) => set('embedUrl', v)} placeholder="https://open.spotify.com/embed/..." />
          </Field>
          <Field label="Description">
            <TextArea value={(s.description as string) ?? ''} onChange={(v) => set('description', v)} rows={2} />
          </Field>
        </div>
      )

    case 'video-embed':
      return (
        <div>
          <Field label="Title">
            <TextInput value={(s.title as string) ?? ''} onChange={(v) => set('title', v)} />
          </Field>
          <Field label="Upload Video">
            <MediaUpload value={(s.videoUrl as string) ?? ''} onChange={(v) => set('videoUrl', v)} accept="video" />
          </Field>
          <Field label="Or paste embed URL (YouTube, Vimeo)">
            <TextInput value={(s.embedUrl as string) ?? ''} onChange={(v) => set('embedUrl', v)} placeholder="https://www.youtube.com/embed/..." />
          </Field>
          <Field label="Description">
            <TextArea value={(s.description as string) ?? ''} onChange={(v) => set('description', v)} rows={2} />
          </Field>
        </div>
      )

    case 'cta-banner':
      return (
        <div>
          <Field label="Headline">
            <TextInput value={(s.headline as string) ?? ''} onChange={(v) => set('headline', v)} />
          </Field>
          <Field label="Subheadline">
            <TextInput value={(s.subheadline as string) ?? ''} onChange={(v) => set('subheadline', v)} />
          </Field>
          <Field label="Button Text">
            <TextInput value={(s.ctaText as string) ?? ''} onChange={(v) => set('ctaText', v)} />
          </Field>
          <Field label="Button URL">
            <TextInput value={(s.ctaUrl as string) ?? ''} onChange={(v) => set('ctaUrl', v)} />
          </Field>
          <Field label="Background Color">
            <input type="color" value={(s.backgroundColor as string) ?? '#1A1815'} onChange={(e) => set('backgroundColor', e.target.value)} className="w-full h-8 rounded cursor-pointer" />
          </Field>
          <Field label="Text Color">
            <input type="color" value={(s.textColor as string) ?? '#F5F0E8'} onChange={(e) => set('textColor', e.target.value)} className="w-full h-8 rounded cursor-pointer" />
          </Field>
          <Field label="Accent Color">
            <input type="color" value={(s.accentColor as string) ?? '#C4892A'} onChange={(e) => set('accentColor', e.target.value)} className="w-full h-8 rounded cursor-pointer" />
          </Field>
        </div>
      )

    case 'email-signup':
      return (
        <div>
          <Field label="Headline">
            <TextInput value={(s.headline as string) ?? ''} onChange={(v) => set('headline', v)} />
          </Field>
          <Field label="Subheadline">
            <TextInput value={(s.subheadline as string) ?? ''} onChange={(v) => set('subheadline', v)} />
          </Field>
          <Field label="Button Text">
            <TextInput value={(s.buttonText as string) ?? 'Subscribe'} onChange={(v) => set('buttonText', v)} />
          </Field>
          <Field label="Input Placeholder">
            <TextInput value={(s.placeholder as string) ?? 'Your email'} onChange={(v) => set('placeholder', v)} />
          </Field>
        </div>
      )

    case 'divider':
      return (
        <div>
          <Field label="Height">
            <select value={(s.height as string) ?? 'md'} onChange={(e) => set('height', e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background">
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
              <option value="xl">Extra Large</option>
            </select>
          </Field>
        </div>
      )

    default:
      return (
        <div className="p-4 text-sm text-muted-foreground">
          No settings available for this section type.
        </div>
      )
  }
}

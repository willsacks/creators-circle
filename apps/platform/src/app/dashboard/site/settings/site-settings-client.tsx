'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus, Trash2, GripVertical } from 'lucide-react'

const THEMES = [
  { id: 'sage-dark', name: 'Sage Dark', bg: '#0E0D0C', accent: '#C4892A' },
  { id: 'sage-light', name: 'Sage Light', bg: '#FAF8F5', accent: '#C4892A' },
  { id: 'midnight', name: 'Midnight', bg: '#0A0C14', accent: '#7B8FD4' },
  { id: 'earth', name: 'Earth', bg: '#1C1612', accent: '#9E6B3F' },
]

interface NavLink {
  id?: string
  label: string
  url: string
  order: number
  openInNew: boolean
}

interface Profile {
  id: string
  artistName: string
  slug: string
  tagline: string | null
  bio: string | null
  heroImageUrl: string | null
  sitePublished: boolean
  siteTheme: string
  customDomain: string | null
  seoTitle: string | null
  seoDescription: string | null
  socialLinks: string | null
  navLinks: NavLink[]
}

export function SiteSettingsClient({ profile }: { profile: Profile | null }) {
  const [artistName, setArtistName] = useState(profile?.artistName ?? '')
  const [slug, setSlug] = useState(profile?.slug ?? '')
  const [tagline, setTagline] = useState(profile?.tagline ?? '')
  const [bio, setBio] = useState(profile?.bio ?? '')
  const [siteTheme, setSiteTheme] = useState(profile?.siteTheme ?? 'sage-dark')
  const [seoTitle, setSeoTitle] = useState(profile?.seoTitle ?? '')
  const [seoDescription, setSeoDescription] = useState(profile?.seoDescription ?? '')
  const [customDomain, setCustomDomain] = useState(profile?.customDomain ?? '')
  const [sitePublished, setSitePublished] = useState(profile?.sitePublished ?? false)
  const [navLinks, setNavLinks] = useState<NavLink[]>(profile?.navLinks ?? [])
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  function addNavLink() {
    setNavLinks((prev) => [...prev, { label: '', url: '', order: prev.length, openInNew: false }])
  }

  function updateNavLink(i: number, key: keyof NavLink, value: string | boolean | number) {
    setNavLinks((prev) => prev.map((l, idx) => (idx === i ? { ...l, [key]: value } : l)))
  }

  function removeNavLink(i: number) {
    setNavLinks((prev) => prev.filter((_, idx) => idx !== i))
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/profile/site', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artistName,
          slug,
          tagline,
          bio,
          siteTheme,
          seoTitle,
          seoDescription,
          customDomain,
          sitePublished,
          navLinks: navLinks.map((l, i) => ({ ...l, order: i })),
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Failed')
      }
      toast.success('Site settings saved!')
      router.refresh()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold mb-1">Site Settings</h1>
          <p className="text-muted-foreground">Configure your artist site.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-cc-gold text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-cc-gold-dark disabled:opacity-60 transition-colors"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Basic info */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-serif text-xl font-bold mb-5">Basic Info</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Artist Name</label>
              <input type="text" value={artistName} onChange={(e) => setArtistName(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-cc-gold" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">URL Slug</label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">{(process.env.NEXT_PUBLIC_ARTIST_SITES_URL ?? 'http://localhost:3001').replace('https://', '').replace('http://', '')}/</span>
                <input type="text" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-cc-gold" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Tagline</label>
              <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="A short phrase about you" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-cc-gold" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Bio</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-cc-gold resize-none" />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Published</p>
                <p className="text-xs text-muted-foreground">Make your site publicly visible</p>
              </div>
              <button
                onClick={() => setSitePublished(!sitePublished)}
                className={`relative w-11 h-6 rounded-full transition-colors ${sitePublished ? 'bg-cc-gold' : 'bg-muted'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${sitePublished ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Theme */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-serif text-xl font-bold mb-5">Theme</h2>
          <div className="grid grid-cols-2 gap-3">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSiteTheme(theme.id)}
                className={`relative p-4 rounded-xl border-2 transition-colors ${siteTheme === theme.id ? 'border-cc-gold' : 'border-border hover:border-cc-gold/40'}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: theme.bg }} />
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.accent }} />
                </div>
                <p className="text-sm font-medium text-left">{theme.name}</p>
                {siteTheme === theme.id && (
                  <span className="absolute top-2 right-2 text-cc-gold text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-xl font-bold">Navigation</h2>
            <button onClick={addNavLink} className="flex items-center gap-1.5 text-sm text-cc-gold hover:underline">
              <Plus size={14} /> Add Link
            </button>
          </div>
          <div className="space-y-2">
            {navLinks.map((link, i) => (
              <div key={i} className="flex items-center gap-2">
                <GripVertical size={16} className="text-muted-foreground shrink-0" />
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => updateNavLink(i, 'label', e.target.value)}
                  placeholder="Label"
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-cc-gold"
                />
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => updateNavLink(i, 'url', e.target.value)}
                  placeholder="/page or https://..."
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-cc-gold"
                />
                <button onClick={() => removeNavLink(i)} className="text-muted-foreground hover:text-destructive transition-colors p-1">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {navLinks.length === 0 && (
              <p className="text-sm text-muted-foreground">No nav links. Click "Add Link" to create some.</p>
            )}
          </div>
        </div>

        {/* SEO */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-serif text-xl font-bold mb-5">SEO</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">SEO Title</label>
              <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="Your Name — Artist & Creator" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-cc-gold" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">SEO Description</label>
              <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={3} placeholder="A brief description of you and your work..." className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-cc-gold resize-none" />
            </div>
          </div>
        </div>

        {/* Custom domain */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-serif text-xl font-bold mb-2">Custom Domain</h2>
          <p className="text-sm text-muted-foreground mb-4">Connect your own domain to your artist site.</p>
          <input type="text" value={customDomain} onChange={(e) => setCustomDomain(e.target.value)} placeholder="www.yourname.com" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-cc-gold" />
          <p className="text-xs text-muted-foreground mt-2">
            After saving, point your domain's CNAME to <code className="bg-muted px-1 py-0.5 rounded">sites.creatorscircle.com</code> to complete setup.
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-cc-gold text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-cc-gold-dark disabled:opacity-60 transition-colors"
        >
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>
    </div>
  )
}

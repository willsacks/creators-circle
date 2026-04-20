'use client'

import Link from 'next/link'
import { useState } from 'react'

interface NavLink {
  id: string
  label: string
  url: string
  openInNew: boolean
}

interface Theme {
  bg: string
  surface: string
  text: string
  accent: string
  muted: string
  fontHeading: string
  navBg: string
}

interface SiteNavProps {
  artistName: string
  artistSlug: string
  navLinks: NavLink[]
  theme: Theme
  socialLinks: Record<string, string>
}

export function SiteNav({ artistName, artistSlug, navLinks, theme, socialLinks }: SiteNavProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backdropFilter: 'blur(12px)',
        backgroundColor: theme.navBg,
        borderBottom: `1px solid ${theme.muted}20`,
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link
          href={`/${artistSlug}`}
          style={{ fontFamily: theme.fontHeading, fontSize: '1.5rem', color: theme.text, textDecoration: 'none', letterSpacing: '0.02em' }}
        >
          {artistName}
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="hidden md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              href={link.url}
              target={link.openInNew ? '_blank' : undefined}
              style={{ color: theme.muted, textDecoration: 'none', fontSize: '0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = theme.text)}
              onMouseLeave={(e) => (e.currentTarget.style.color = theme.muted)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ color: theme.text, background: 'none', border: 'none', fontSize: '1.5rem', lineHeight: 1 }}
          className="md:hidden"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{ backgroundColor: theme.surface, borderTop: `1px solid ${theme.muted}20`, padding: '24px' }}
          className="md:hidden"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.url}
                onClick={() => setMenuOpen(false)}
                style={{ color: theme.text, textDecoration: 'none', fontSize: '1.125rem', fontFamily: theme.fontHeading }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

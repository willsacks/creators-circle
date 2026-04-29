'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NotFound() {
  const pathname = usePathname()
  const artistSlug = pathname.split('/')[1] ?? ''

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0E0D0C',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '48px 24px',
      fontFamily: 'Georgia, serif',
    }}>
      <p style={{ color: '#C4892A', fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '24px' }}>
        404
      </p>
      <h1 style={{ color: '#F5F0E8', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 400, lineHeight: 1.2, marginBottom: '16px' }}>
        Page not found
      </h1>
      <p style={{ color: '#8C8680', fontSize: '1rem', lineHeight: 1.7, maxWidth: '400px', marginBottom: '48px' }}>
        The page you're looking for doesn't exist or may have moved.
      </p>
      {artistSlug && (
        <Link
          href={`/${artistSlug}`}
          style={{
            color: '#F5F0E8',
            fontSize: '0.875rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            borderBottom: '1px solid #C4892A',
            paddingBottom: '2px',
            transition: 'opacity 0.2s',
          }}
        >
          Back to home
        </Link>
      )}
    </div>
  )
}

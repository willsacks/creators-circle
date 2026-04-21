'use client'

type Theme = {
  bg: string
  surface: string
  text: string
  accent: string
  muted: string
  fontHeading: string
  fontBody: string
}

type Section = {
  id: string
  type: string
  settings: Record<string, unknown>
}

const paddingMap: Record<string, string> = {
  none: '0',
  sm: '32px',
  md: '64px',
  lg: '96px',
  xl: '128px',
}

function getPadding(value: unknown) {
  return paddingMap[(value as string) ?? 'lg'] ?? '96px'
}

export function SectionRenderer({ section, theme }: { section: Section; theme: Theme }) {
  const s = section.settings

  switch (section.type) {
    case 'hero-fullwidth': {
      const paddingTop = s.height === 'medium' ? '200px' : '0'
      return (
        <section
          style={{
            position: 'relative',
            width: '100%',
            minHeight: s.height === 'medium' ? '60vh' : '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            backgroundImage: s.backgroundImage ? `url(${s.backgroundImage as string})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: !s.backgroundImage ? '#1A1815' : undefined,
          }}
        >
          {/* Overlay */}
          <div style={{ position: 'absolute', inset: 0, backgroundColor: '#000', opacity: (s.overlayOpacity as number) ?? 0.5 }} />
          {/* Content */}
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '120px 24px 80px', maxWidth: '900px' }} className="animate-fade-up">
            <h1
              style={{
                fontFamily: theme.fontHeading,
                fontSize: 'clamp(3rem, 8vw, 7rem)',
                color: (s.textColor as string) ?? '#fff',
                lineHeight: 1.1,
                marginBottom: '24px',
                letterSpacing: '-0.01em',
              }}
            >
              {(s.headline as string) || 'Headline'}
            </h1>
            {!!s.subheadline && (
              <p
                style={{
                  fontSize: 'clamp(1rem, 2vw, 1.5rem)',
                  color: (s.textColor as string) ?? '#fff',
                  opacity: 0.8,
                  marginBottom: '40px',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
                className="animate-fade-up-delay-1"
              >
                {s.subheadline as string}
              </p>
            )}
            {!!s.ctaText && !!s.ctaUrl && (
              <a
                href={s.ctaUrl as string}
                style={{
                  display: 'inline-block',
                  backgroundColor: theme.accent,
                  color: '#fff',
                  padding: '16px 40px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  transition: 'opacity 0.2s',
                }}
                className="animate-fade-up-delay-2"
              >
                {s.ctaText as string}
              </a>
            )}
          </div>
        </section>
      )
    }

    case 'hero-split': {
      const imgLeft = s.imagePosition === 'left'
      return (
        <section style={{ display: 'flex', minHeight: '70vh', marginTop: '72px' }}>
          {imgLeft && (
            <div style={{ flex: 1, backgroundImage: s.image ? `url(${s.image as string})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: theme.surface, minHeight: '400px' }} />
          )}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '80px 60px', backgroundColor: theme.surface }}>
            <div>
              <h1 style={{ fontFamily: theme.fontHeading, fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: theme.text, marginBottom: '24px', lineHeight: 1.1 }}>
                {(s.headline as string) || 'Headline'}
              </h1>
              {!!s.subheadline && <p style={{ color: theme.muted, fontSize: '1.125rem', lineHeight: 1.7, marginBottom: '32px' }}>{s.subheadline as string}</p>}
              {!!s.ctaText && !!s.ctaUrl && (
                <a href={s.ctaUrl as string} style={{ display: 'inline-block', backgroundColor: theme.accent, color: '#fff', padding: '14px 32px', borderRadius: '4px', textDecoration: 'none', fontSize: '0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {s.ctaText as string}
                </a>
              )}
            </div>
          </div>
          {!imgLeft && (
            <div style={{ flex: 1, backgroundImage: s.image ? `url(${s.image as string})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: theme.surface, minHeight: '400px' }} />
          )}
        </section>
      )
    }

    case 'text-centered': {
      const maxWidths: Record<string, string> = { sm: '560px', md: '720px', lg: '960px', xl: '100%' }
      return (
        <section style={{ padding: `${getPadding(s.paddingTop)} 24px ${getPadding(s.paddingBottom)}`, textAlign: 'center' }}>
          <div
            style={{ maxWidth: maxWidths[(s.maxWidth as string) ?? 'md'] ?? '720px', margin: '0 auto', fontFamily: theme.fontHeading, fontSize: 'clamp(1.125rem, 2vw, 1.375rem)', color: theme.text, lineHeight: 1.9 }}
            dangerouslySetInnerHTML={{ __html: (s.content as string) ?? '' }}
          />
        </section>
      )
    }

    case 'text-two-column':
      return (
        <section style={{ padding: `${getPadding(s.paddingTop)} 24px ${getPadding(s.paddingBottom)}` }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px' }}>
            <div style={{ color: theme.text, lineHeight: 1.8, fontSize: '1rem' }} dangerouslySetInnerHTML={{ __html: (s.leftContent as string) ?? '' }} />
            <div style={{ color: theme.text, lineHeight: 1.8, fontSize: '1rem' }} dangerouslySetInnerHTML={{ __html: (s.rightContent as string) ?? '' }} />
          </div>
        </section>
      )

    case 'gallery-masonry': {
      const images = (s.images as Array<{ url: string; caption?: string }>) ?? []
      const cols = (s.columns as number) ?? 3
      return (
        <section style={{ padding: `${getPadding(s.paddingTop)} 0 ${getPadding(s.paddingBottom)}` }}>
          <div style={{ columns: cols, columnGap: '8px', padding: '0 8px' }}>
            {images.map((img, i) => (
              <div key={i} style={{ breakInside: 'avoid', marginBottom: '8px', overflow: 'hidden' }}>
                <img
                  src={img.url}
                  alt={img.caption ?? ''}
                  style={{ width: '100%', display: 'block', transition: 'transform 0.4s ease' }}
                  loading="lazy"
                />
                {!!s.showCaptions && !!img.caption && (
                  <p style={{ color: theme.muted, fontSize: '0.75rem', padding: '8px', textAlign: 'center' }}>{img.caption}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )
    }

    case 'gallery-slider': {
      const images = (s.images as Array<{ url: string; caption?: string }>) ?? []
      return (
        <section style={{ padding: `${getPadding(s.paddingTop)} 0 ${getPadding(s.paddingBottom)}`, overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: '8px', padding: '0 8px', width: 'max-content' }}>
            {images.map((img, i) => (
              <div key={i} style={{ width: '70vw', maxWidth: '700px', flexShrink: 0 }}>
                <img src={img.url} alt={img.caption ?? ''} style={{ width: '100%', height: '500px', objectFit: 'cover', display: 'block' }} loading="lazy" />
                {!!s.showCaptions && !!img.caption && (
                  <p style={{ color: theme.muted, fontSize: '0.75rem', padding: '8px', textAlign: 'center' }}>{img.caption}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )
    }

    case 'offering-card-grid': {
      const offerings = (s.offerings as Array<{ id: string; title: string; description: string; price: string; priceNote?: string; image?: string; ctaText: string; ctaUrl: string; badge?: string }>) ?? []
      return (
        <section style={{ padding: `${getPadding(s.paddingTop)} 24px ${getPadding(s.paddingBottom)}`, backgroundColor: theme.surface }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            {offerings.map((offering) => (
              <div key={offering.id} style={{ backgroundColor: theme.bg, borderRadius: '8px', overflow: 'hidden', border: `1px solid ${theme.muted}30` }}>
                {offering.image && (
                  <div style={{ height: '240px', backgroundImage: `url(${offering.image})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                    {offering.badge && (
                      <span style={{ position: 'absolute', top: '16px', left: '16px', backgroundColor: theme.accent, color: '#fff', padding: '4px 12px', borderRadius: '3px', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                        {offering.badge}
                      </span>
                    )}
                  </div>
                )}
                <div style={{ padding: '32px' }}>
                  <h3 style={{ fontFamily: theme.fontHeading, fontSize: '1.75rem', color: theme.text, marginBottom: '12px' }}>{offering.title}</h3>
                  <p style={{ color: theme.muted, lineHeight: 1.7, marginBottom: '24px', fontSize: '0.9375rem' }}>{offering.description}</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '24px' }}>
                    <span style={{ fontFamily: theme.fontHeading, fontSize: '2rem', color: theme.text }}>{offering.price}</span>
                    {offering.priceNote && <span style={{ color: theme.muted, fontSize: '0.875rem' }}>{offering.priceNote}</span>}
                  </div>
                  <a href={offering.ctaUrl} style={{ display: 'block', textAlign: 'center', backgroundColor: theme.accent, color: '#fff', padding: '14px', borderRadius: '4px', textDecoration: 'none', fontSize: '0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {offering.ctaText}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )
    }

    case 'offering-hero':
      return (
        <section style={{ position: 'relative', padding: `${getPadding(s.paddingTop)} 0 ${getPadding(s.paddingBottom)}`, backgroundImage: s.backgroundImage ? `url(${s.backgroundImage as string})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: !s.backgroundImage ? theme.surface : undefined }}>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: '#000', opacity: (s.overlayOpacity as number) ?? 0.6 }} />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
            <h2 style={{ fontFamily: theme.fontHeading, fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: '#fff', marginBottom: '24px', lineHeight: 1.1 }}>
              {(s.title as string) || 'Offering Title'}
            </h2>
            {!!s.description && <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.125rem', lineHeight: 1.7, marginBottom: '40px' }}>{s.description as string}</p>}
            {!!s.ctaText && !!s.ctaUrl && (
              <a href={s.ctaUrl as string} style={{ display: 'inline-block', backgroundColor: theme.accent, color: '#fff', padding: '16px 40px', borderRadius: '4px', textDecoration: 'none', fontSize: '0.875rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {s.ctaText as string}
              </a>
            )}
          </div>
        </section>
      )

    case 'music-embed':
      return (
        <section style={{ padding: `${getPadding(s.paddingTop)} 24px ${getPadding(s.paddingBottom)}`, backgroundColor: theme.surface }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            {!!s.title && <h2 style={{ fontFamily: theme.fontHeading, fontSize: 'clamp(2rem, 4vw, 3rem)', color: theme.text, marginBottom: '16px' }}>{s.title as string}</h2>}
            {!!s.description && <p style={{ color: theme.muted, marginBottom: '32px' }}>{s.description as string}</p>}
            {!!s.embedUrl && (
              <iframe
                src={s.embedUrl as string}
                width="100%"
                height="352"
                style={{ border: 'none', borderRadius: '12px' }}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            )}
          </div>
        </section>
      )

    case 'video-embed':
      return (
        <section style={{ padding: `${getPadding(s.paddingTop)} 0 ${getPadding(s.paddingBottom)}` }}>
          {!!s.title && (
            <div style={{ textAlign: 'center', marginBottom: '32px', padding: '0 24px' }}>
              <h2 style={{ fontFamily: theme.fontHeading, fontSize: '3rem', color: theme.text }}>{s.title as string}</h2>
            </div>
          )}
          {!!s.embedUrl && (
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
              <iframe src={s.embedUrl as string} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} loading="lazy" />
            </div>
          )}
        </section>
      )

    case 'testimonial-quotes': {
      const quotes = (s.quotes as Array<{ text: string; author: string; title?: string }>) ?? []
      return (
        <section style={{ padding: `${getPadding(s.paddingTop)} 24px ${getPadding(s.paddingBottom)}`, backgroundColor: theme.surface }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '48px' }}>
            {quotes.map((quote, i) => (
              <blockquote key={i} style={{ margin: 0, borderLeft: `3px solid ${theme.accent}`, paddingLeft: '32px' }}>
                <p style={{ fontFamily: theme.fontHeading, fontSize: 'clamp(1.1rem, 2vw, 1.375rem)', color: theme.text, lineHeight: 1.7, marginBottom: '20px', fontStyle: 'italic' }}>
                  "{quote.text}"
                </p>
                <footer>
                  <p style={{ color: theme.accent, fontWeight: 500, fontSize: '0.875rem' }}>— {quote.author}</p>
                  {quote.title && <p style={{ color: theme.muted, fontSize: '0.8rem', marginTop: '4px' }}>{quote.title}</p>}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      )
    }

    case 'cta-banner':
      return (
        <section style={{ backgroundColor: (s.backgroundColor as string) ?? theme.surface, padding: `${getPadding(s.paddingTop)} 24px ${getPadding(s.paddingBottom)}`, textAlign: 'center' }}>
          <h2 style={{ fontFamily: theme.fontHeading, fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: (s.textColor as string) ?? theme.text, marginBottom: '16px', lineHeight: 1.1 }}>
            {(s.headline as string) || 'Call to Action'}
          </h2>
          {!!s.subheadline && <p style={{ color: `${(s.textColor as string) ?? theme.text}99`, fontSize: '1.125rem', marginBottom: '40px' }}>{s.subheadline as string}</p>}
          {!!s.ctaText && !!s.ctaUrl && (
            <a href={s.ctaUrl as string} style={{ display: 'inline-block', backgroundColor: (s.accentColor as string) ?? theme.accent, color: '#fff', padding: '18px 48px', borderRadius: '4px', textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {s.ctaText as string}
            </a>
          )}
        </section>
      )

    case 'email-signup':
      return (
        <section style={{ padding: `${getPadding(s.paddingTop)} 24px ${getPadding(s.paddingBottom)}`, textAlign: 'center', backgroundColor: theme.surface }}>
          <h2 style={{ fontFamily: theme.fontHeading, fontSize: 'clamp(2rem, 4vw, 3rem)', color: theme.text, marginBottom: '12px' }}>
            {(s.headline as string) || 'Join the list'}
          </h2>
          {!!s.subheadline && <p style={{ color: theme.muted, fontSize: '1rem', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px' }}>{s.subheadline as string}</p>}
          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', gap: '12px', maxWidth: '480px', margin: '0 auto' }}>
            <input
              type="email"
              placeholder={(s.placeholder as string) ?? 'Your email address'}
              style={{ flex: 1, padding: '14px 20px', borderRadius: '4px', border: `1px solid ${theme.muted}40`, backgroundColor: theme.bg, color: theme.text, fontSize: '1rem', outline: 'none' }}
            />
            <button type="submit" style={{ padding: '14px 28px', backgroundColor: theme.accent, color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
              {(s.buttonText as string) ?? 'Subscribe'}
            </button>
          </form>
        </section>
      )

    case 'social-links': {
      const links = (s.links as Array<{ platform: string; url: string; label: string }>) ?? []
      const icons: Record<string, string> = {
        instagram: '📷', spotify: '🎵', youtube: '▶️', bandcamp: '🎸', tiktok: '🎬', twitter: '🐦', facebook: '👤',
      }
      return (
        <section style={{ padding: `${getPadding(s.paddingTop)} 24px ${getPadding(s.paddingBottom)}`, textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
            {links.map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.muted, textDecoration: 'none', fontSize: '0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'color 0.2s' }}>
                <span style={{ fontSize: '1.25rem' }}>{icons[link.platform] ?? '🔗'}</span>
                {link.label}
              </a>
            ))}
          </div>
        </section>
      )
    }

    case 'contact-form': {
      const fields = (s.fields as Array<{ name: string; label: string; type: string; required?: boolean; options?: string[] }>) ?? []
      return (
        <section style={{ padding: `${getPadding(s.paddingTop)} 24px ${getPadding(s.paddingBottom)}` }}>
          <form style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }} onSubmit={(e) => e.preventDefault()}>
            {fields.map((field) => (
              <div key={field.name} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: theme.text, fontSize: '0.875rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  {field.label}{field.required && ' *'}
                </label>
                {field.type === 'textarea' ? (
                  <textarea rows={5} style={{ padding: '14px 20px', borderRadius: '4px', border: `1px solid ${theme.muted}40`, backgroundColor: theme.surface, color: theme.text, fontSize: '1rem', resize: 'vertical', outline: 'none' }} />
                ) : field.type === 'select' ? (
                  <select style={{ padding: '14px 20px', borderRadius: '4px', border: `1px solid ${theme.muted}40`, backgroundColor: theme.surface, color: theme.text, fontSize: '1rem', outline: 'none' }}>
                    {field.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input type={field.type} style={{ padding: '14px 20px', borderRadius: '4px', border: `1px solid ${theme.muted}40`, backgroundColor: theme.surface, color: theme.text, fontSize: '1rem', outline: 'none' }} />
                )}
              </div>
            ))}
            <button type="submit" style={{ alignSelf: 'flex-start', padding: '16px 40px', backgroundColor: theme.accent, color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.875rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
              {(s.submitText as string) ?? 'Send'}
            </button>
          </form>
        </section>
      )
    }

    case 'divider':
      return (
        <section style={{ padding: `${getPadding(s.height)} 0` }}>
          <div style={{ borderTop: `1px solid ${theme.muted}30`, margin: '0 auto', maxWidth: '1200px' }} />
        </section>
      )

    default:
      return null
  }
}

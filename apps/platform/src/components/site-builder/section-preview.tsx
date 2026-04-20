import { Section } from './page-editor'

interface SectionPreviewProps {
  section: Section
}

export function SectionPreview({ section }: SectionPreviewProps) {
  const s = section.settings

  switch (section.type) {
    case 'hero-fullwidth':
      return (
        <div
          className="relative h-48 flex items-center justify-center text-center"
          style={{
            backgroundImage: s.backgroundImage ? `url(${s.backgroundImage as string})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: !s.backgroundImage ? '#1A1815' : undefined,
          }}
        >
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: (s.overlayOpacity as number) ?? 0.5 }}
          />
          <div className="relative z-10 px-8">
            <h2
              className="font-serif text-2xl font-bold mb-2"
              style={{ color: (s.textColor as string) ?? '#fff' }}
            >
              {(s.headline as string) || 'Hero Headline'}
            </h2>
            {!!s.subheadline && (
              <p className="text-sm opacity-80" style={{ color: (s.textColor as string) ?? '#fff' }}>
                {s.subheadline as string}
              </p>
            )}
            {!!s.ctaText && (
              <div className="mt-4 inline-block bg-cc-gold text-white text-xs px-4 py-2 rounded-lg">
                {s.ctaText as string}
              </div>
            )}
          </div>
        </div>
      )

    case 'hero-split':
      return (
        <div className="flex h-36">
          {s.imagePosition === 'left' && (
            <div
              className="w-1/2 bg-stone-200"
              style={{
                backgroundImage: s.image ? `url(${s.image as string})` : undefined,
                backgroundSize: 'cover',
              }}
            />
          )}
          <div className="flex-1 flex flex-col justify-center px-6 bg-white">
            <h2 className="font-serif text-lg font-bold">{(s.headline as string) || 'Headline'}</h2>
            {!!s.subheadline && <p className="text-xs text-muted-foreground mt-1">{s.subheadline as string}</p>}
          </div>
          {s.imagePosition !== 'left' && (
            <div
              className="w-1/2 bg-stone-200"
              style={{
                backgroundImage: s.image ? `url(${s.image as string})` : undefined,
                backgroundSize: 'cover',
              }}
            />
          )}
        </div>
      )

    case 'text-centered':
      return (
        <div className="py-8 px-12 text-center">
          <div
            className="text-sm text-foreground leading-relaxed max-w-lg mx-auto"
            dangerouslySetInnerHTML={{ __html: (s.content as string) ?? '<p>Text content</p>' }}
          />
        </div>
      )

    case 'text-two-column':
      return (
        <div className="py-8 px-8 grid grid-cols-2 gap-8">
          <div className="text-sm text-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: (s.leftContent as string) ?? '' }} />
          <div className="text-sm text-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: (s.rightContent as string) ?? '' }} />
        </div>
      )

    case 'gallery-masonry':
    case 'gallery-slider': {
      const images = (s.images as Array<{ url: string }>) ?? []
      return (
        <div className="p-4">
          <p className="text-xs text-muted-foreground mb-2 font-medium">
            {section.type === 'gallery-masonry' ? 'Masonry Gallery' : 'Image Slider'} — {images.length} image{images.length !== 1 ? 's' : ''}
          </p>
          <div className="flex gap-2 overflow-hidden">
            {images.slice(0, 4).map((img, i) => (
              <div
                key={i}
                className="w-16 h-16 rounded bg-stone-200 shrink-0"
                style={{ backgroundImage: `url(${img.url})`, backgroundSize: 'cover' }}
              />
            ))}
            {images.length === 0 && (
              <div className="w-16 h-16 rounded bg-stone-100 flex items-center justify-center text-xs text-muted-foreground">
                No images
              </div>
            )}
          </div>
        </div>
      )
    }

    case 'offering-card-grid': {
      const offerings = (s.offerings as Array<{ title: string }>) ?? []
      return (
        <div className="p-6">
          <p className="text-xs text-muted-foreground mb-3 font-medium">Offering Cards ({offerings.length})</p>
          <div className="flex gap-3">
            {offerings.slice(0, 3).map((o, i) => (
              <div key={i} className="flex-1 bg-stone-100 rounded-lg p-3 text-xs font-medium truncate">
                {o.title}
              </div>
            ))}
            {offerings.length === 0 && (
              <div className="text-sm text-muted-foreground">No offerings added</div>
            )}
          </div>
        </div>
      )
    }

    case 'offering-hero':
      return (
        <div
          className="relative h-36 flex items-center px-8"
          style={{
            backgroundImage: s.backgroundImage ? `url(${s.backgroundImage as string})` : undefined,
            backgroundSize: 'cover',
            backgroundColor: !s.backgroundImage ? '#1A1815' : undefined,
          }}
        >
          <div className="absolute inset-0 bg-black" style={{ opacity: (s.overlayOpacity as number) ?? 0.6 }} />
          <div className="relative z-10">
            <h3 className="font-serif text-lg font-bold text-white">{(s.title as string) || 'Offering Title'}</h3>
            <p className="text-xs text-white/70 mt-1 max-w-sm">{(s.description as string) || ''}</p>
          </div>
        </div>
      )

    case 'music-embed':
      return (
        <div className="py-8 px-8 text-center bg-stone-50">
          <div className="text-3xl mb-2">🎵</div>
          <p className="font-medium text-sm">{(s.title as string) || 'Music Embed'}</p>
          <p className="text-xs text-muted-foreground mt-1">{(s.embedUrl as string) || 'No embed URL set'}</p>
        </div>
      )

    case 'video-embed':
      return (
        <div className="py-8 px-8 text-center bg-stone-50">
          <div className="text-3xl mb-2">▶️</div>
          <p className="font-medium text-sm">{(s.title as string) || 'Video Embed'}</p>
        </div>
      )

    case 'testimonial-quotes': {
      const quotes = (s.quotes as Array<{ text: string; author: string }>) ?? []
      return (
        <div className="py-8 px-8">
          <p className="text-xs text-muted-foreground mb-4 font-medium">Testimonials ({quotes.length})</p>
          {quotes.slice(0, 2).map((q, i) => (
            <div key={i} className="mb-4 border-l-2 border-cc-gold pl-4">
              <p className="text-sm italic text-foreground">"{q.text}"</p>
              <p className="text-xs text-muted-foreground mt-1">— {q.author}</p>
            </div>
          ))}
        </div>
      )
    }

    case 'cta-banner':
      return (
        <div
          className="py-10 px-8 text-center"
          style={{ backgroundColor: (s.backgroundColor as string) ?? '#1A1815' }}
        >
          <h3
            className="font-serif text-xl font-bold mb-2"
            style={{ color: (s.textColor as string) ?? '#F5F0E8' }}
          >
            {(s.headline as string) || 'Call to Action'}
          </h3>
          {!!s.ctaText && (
            <div
              className="inline-block mt-3 px-6 py-2 rounded-lg text-sm font-medium text-white"
              style={{ backgroundColor: (s.accentColor as string) ?? '#C4892A' }}
            >
              {s.ctaText as string}
            </div>
          )}
        </div>
      )

    case 'email-signup':
      return (
        <div className="py-10 px-8 text-center bg-stone-50">
          <h3 className="font-serif text-xl font-bold mb-2">{(s.headline as string) || 'Join the list'}</h3>
          <div className="flex gap-2 max-w-sm mx-auto mt-4">
            <div className="flex-1 h-9 rounded-lg border border-stone-300 bg-white" />
            <div className="px-4 h-9 rounded-lg bg-cc-gold text-xs text-white flex items-center">
              {(s.buttonText as string) || 'Subscribe'}
            </div>
          </div>
        </div>
      )

    case 'social-links':
      return (
        <div className="py-8 px-8 text-center">
          <p className="text-xs text-muted-foreground mb-3 font-medium">Social Links</p>
          <div className="flex justify-center gap-4">
            {((s.links as Array<{ platform: string }>) ?? []).map((l, i) => (
              <div key={i} className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-sm">
                {l.platform === 'instagram' ? '📷' : l.platform === 'spotify' ? '🎵' : l.platform === 'youtube' ? '▶' : '🔗'}
              </div>
            ))}
          </div>
        </div>
      )

    case 'contact-form':
      return (
        <div className="py-8 px-8">
          <div className="space-y-3 max-w-md mx-auto">
            <div className="h-9 rounded-lg border border-stone-200 bg-stone-50" />
            <div className="h-9 rounded-lg border border-stone-200 bg-stone-50" />
            <div className="h-20 rounded-lg border border-stone-200 bg-stone-50" />
            <div className="h-9 w-32 rounded-lg bg-cc-gold" />
          </div>
        </div>
      )

    case 'divider':
      return (
        <div className="py-4 px-8">
          <div className="border-t border-stone-200" />
        </div>
      )

    default:
      return (
        <div className="py-6 px-8 text-center text-muted-foreground text-sm">
          {section.type} section
        </div>
      )
  }
}

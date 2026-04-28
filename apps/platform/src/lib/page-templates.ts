import { randomUUID } from 'crypto'

interface Profile {
  artistName: string
  tagline: string | null
  bio: string | null
  heroImageUrl: string | null
  socialLinks: string | null
  slug: string
}

type Section = { id: string; type: string; settings: Record<string, unknown> }

function s(type: string, settings: Record<string, unknown>): Section {
  return { id: randomUUID(), type, settings }
}

function parseSocialLinks(raw: string | null): Array<{ platform: string; url: string; label: string }> {
  if (!raw) return []
  try {
    const obj = JSON.parse(raw) as Record<string, string>
    const labels: Record<string, string> = {
      instagram: 'Instagram', spotify: 'Spotify', youtube: 'YouTube',
      bandcamp: 'Bandcamp', tiktok: 'TikTok', twitter: 'Twitter', facebook: 'Facebook',
    }
    return Object.entries(obj)
      .filter(([, url]) => !!url)
      .map(([platform, url]) => ({ platform, url, label: labels[platform] ?? platform }))
  } catch {
    return []
  }
}

export function buildSectionsForPageType(pageType: string, profile: Profile): Section[] {
  const { artistName, tagline, bio, heroImageUrl, socialLinks, slug } = profile
  const name = artistName || 'Artist'
  const tl = tagline || 'Creating work that moves people.'
  const bioText = bio
    ? `<p>${bio}</p>`
    : `<p>${name} is an artist whose work explores the spaces between feeling and form. Rooted in a deep commitment to craft, their practice spans many mediums and continues to evolve with each new project.</p>`

  switch (pageType) {
    case 'HOME':
      return [
        s('hero-fullwidth', {
          headline: name,
          subheadline: tl,
          ctaText: 'Explore My Work',
          ctaUrl: `/${slug}/about`,
          backgroundImage: heroImageUrl ?? '',
          overlayOpacity: heroImageUrl ? 0.45 : 0.6,
          textColor: '#ffffff',
        }),
        s('text-centered', {
          content: bioText,
          maxWidth: 'md',
          paddingTop: 'xl',
          paddingBottom: 'lg',
        }),
        s('divider', { height: 'sm' }),
        s('email-signup', {
          headline: 'Stay in the Loop',
          subheadline: `Be the first to hear about new work, upcoming events, and what ${name} is creating next.`,
          buttonText: 'Subscribe',
          placeholder: 'Your email address',
          paddingTop: 'xl',
          paddingBottom: 'xl',
        }),
      ]

    case 'BIO':
      return [
        s('hero-split', {
          headline: `The Story\nBehind the Work`,
          subheadline: tl,
          image: heroImageUrl ?? '',
          imagePosition: 'right',
          ctaText: 'Get in Touch',
          ctaUrl: `/${slug}/contact`,
        }),
        s('text-centered', {
          content: bioText,
          maxWidth: 'md',
          paddingTop: 'xl',
          paddingBottom: 'lg',
        }),
        s('divider', { height: 'sm' }),
        s('testimonial-quotes', {
          quotes: [
            {
              text: 'Working with them was one of the most transformative creative experiences I have had. Their attention to craft and depth of vision is unmatched.',
              author: 'A Collaborator',
              title: 'Fellow Artist',
            },
            {
              text: 'Their work has a rare quality — it stays with you long after you have experienced it. A true artist in every sense.',
              author: 'A Collector',
              title: 'Patron',
            },
          ],
          paddingTop: 'xl',
          paddingBottom: 'xl',
        }),
        s('cta-banner', {
          headline: `Let's Create Together`,
          subheadline: `Interested in collaborating or commissioning new work?`,
          ctaText: 'Get in Touch',
          ctaUrl: `/${slug}/contact`,
          paddingTop: 'xl',
          paddingBottom: 'xl',
        }),
      ]

    case 'MUSIC':
      return [
        s('hero-fullwidth', {
          headline: 'The Music',
          subheadline: `${name} — Listen Now`,
          backgroundImage: heroImageUrl ?? '',
          overlayOpacity: heroImageUrl ? 0.55 : 0.7,
          textColor: '#ffffff',
          height: 'medium',
        }),
        s('music-embed', {
          title: 'Latest Release',
          description: 'Stream and explore the newest work.',
          embedUrl: '',
          paddingTop: 'xl',
          paddingBottom: 'lg',
        }),
        s('text-centered', {
          content: `<h2>About the Music</h2>${bioText}`,
          maxWidth: 'md',
          paddingTop: 'lg',
          paddingBottom: 'lg',
        }),
        s('divider', { height: 'sm' }),
        s('email-signup', {
          headline: 'Hear It First',
          subheadline: `Join the list to be the first to know when new music from ${name} drops.`,
          buttonText: 'Subscribe',
          placeholder: 'Your email address',
          paddingTop: 'xl',
          paddingBottom: 'xl',
        }),
      ]

    case 'OFFERINGS':
      return [
        s('offering-hero', {
          title: 'Work With Me',
          description: `${name} offers a range of ways to collaborate, commission, and connect. Whether you are looking for original work, a creative partnership, or something bespoke — let's talk.`,
          ctaText: 'Get in Touch',
          ctaUrl: `/${slug}/contact`,
          backgroundImage: heroImageUrl ?? '',
          overlayOpacity: heroImageUrl ? 0.55 : 0.7,
          paddingTop: 'xl',
          paddingBottom: 'xl',
        }),
        s('offering-card-grid', {
          offerings: [
            {
              id: randomUUID(),
              title: 'Original Commission',
              description: 'A fully bespoke piece created just for you. We work closely together through every stage to bring your vision to life.',
              price: 'From $500',
              priceNote: 'based on scope',
              ctaText: 'Inquire',
              ctaUrl: `/${slug}/contact`,
              badge: 'Most Popular',
            },
            {
              id: randomUUID(),
              title: 'Creative Consultation',
              description: 'A focused 60-minute session to explore your creative project, challenge, or vision with expert guidance.',
              price: '$150',
              priceNote: 'per session',
              ctaText: 'Book Now',
              ctaUrl: `/${slug}/contact`,
            },
            {
              id: randomUUID(),
              title: 'Workshop or Talk',
              description: 'Invite me to speak, teach, or lead a creative workshop for your organization, school, or event.',
              price: 'Custom',
              priceNote: 'contact for rates',
              ctaText: 'Learn More',
              ctaUrl: `/${slug}/contact`,
            },
          ],
          paddingTop: 'xl',
          paddingBottom: 'xl',
        }),
        s('divider', { height: 'sm' }),
        s('testimonial-quotes', {
          quotes: [
            {
              text: 'The commission process was thoughtful, professional, and the final piece exceeded every expectation. Truly a joy to work with.',
              author: 'A Client',
              title: 'Commission',
            },
            {
              text: 'The workshop was inspiring, grounding, and exactly what our team needed. We left with new perspective and momentum.',
              author: 'An Organizer',
              title: 'Workshop',
            },
          ],
          paddingTop: 'xl',
          paddingBottom: 'xl',
        }),
        s('cta-banner', {
          headline: 'Ready to Begin?',
          subheadline: `Reach out and let's explore what we might create together.`,
          ctaText: 'Start the Conversation',
          ctaUrl: `/${slug}/contact`,
          paddingTop: 'xl',
          paddingBottom: 'xl',
        }),
      ]

    case 'CONTACT': {
      const socials = parseSocialLinks(socialLinks)
      const sections: Section[] = [
        s('text-centered', {
          content: `<h1>Let's Connect</h1><p>Whether you have a project in mind, a question about the work, or simply want to say hello — this is the place. Reach out and I will be in touch soon.</p>`,
          maxWidth: 'sm',
          paddingTop: 'xl',
          paddingBottom: 'lg',
        }),
        s('contact-form', {
          fields: [
            { name: 'name', label: 'Your Name', type: 'text', required: true },
            { name: 'email', label: 'Email Address', type: 'email', required: true },
            { name: 'subject', label: 'Subject', type: 'text', required: false },
            { name: 'message', label: 'Message', type: 'textarea', required: true },
          ],
          submitText: 'Send Message',
          successMessage: 'Thank you — I will be in touch soon.',
          paddingTop: 'lg',
          paddingBottom: 'xl',
        }),
      ]
      if (socials.length > 0) {
        sections.push(s('divider', { height: 'sm' }))
        sections.push(s('social-links', { links: socials, paddingTop: 'lg', paddingBottom: 'xl' }))
      }
      return sections
    }

    case 'LANDING':
      return [
        s('hero-fullwidth', {
          headline: tl,
          subheadline: name,
          ctaText: 'Work With Me',
          ctaUrl: `/${slug}/offerings`,
          backgroundImage: heroImageUrl ?? '',
          overlayOpacity: heroImageUrl ? 0.5 : 0.65,
          textColor: '#ffffff',
        }),
        s('text-centered', {
          content: bioText,
          maxWidth: 'md',
          paddingTop: 'xl',
          paddingBottom: 'lg',
        }),
        s('offering-card-grid', {
          offerings: [
            {
              id: randomUUID(),
              title: 'Original Commission',
              description: 'A fully bespoke piece created for you — developed together from first sketch to finished work.',
              price: 'From $500',
              ctaText: 'Learn More',
              ctaUrl: `/${slug}/offerings`,
            },
            {
              id: randomUUID(),
              title: 'Creative Session',
              description: 'Spend time working directly together on your vision, project, or creative challenge.',
              price: '$150',
              ctaText: 'Book Now',
              ctaUrl: `/${slug}/contact`,
            },
          ],
          paddingTop: 'xl',
          paddingBottom: 'xl',
        }),
        s('testimonial-quotes', {
          quotes: [
            {
              text: 'A rare combination of vision, skill, and genuine care. Working together changed how I see what is possible.',
              author: 'A Collaborator',
              title: 'Artist',
            },
          ],
          paddingTop: 'lg',
          paddingBottom: 'xl',
        }),
        s('cta-banner', {
          headline: 'Ready to Create Something?',
          subheadline: `Let's start a conversation about what we might make together.`,
          ctaText: 'Get in Touch',
          ctaUrl: `/${slug}/contact`,
          paddingTop: 'xl',
          paddingBottom: 'xl',
        }),
        s('email-signup', {
          headline: 'Stay Connected',
          subheadline: `Follow the journey and be the first to hear about new work from ${name}.`,
          buttonText: 'Subscribe',
          placeholder: 'Your email address',
          paddingTop: 'xl',
          paddingBottom: 'xl',
        }),
      ]

    default:
      return []
  }
}

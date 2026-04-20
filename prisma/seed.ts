import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const willSagePages = {
  home: {
    title: 'Home',
    slug: 'home',
    pageType: 'HOME',
    published: true,
    sections: JSON.stringify([
      {
        id: 'hero-1',
        type: 'hero-fullwidth',
        settings: {
          backgroundImage: 'https://picsum.photos/seed/willsage-hero/1920/1080',
          headline: 'Will Sage',
          subheadline: 'Musician. Creator. Soul Excavator.',
          ctaText: 'Enter',
          ctaUrl: '#about',
          overlayOpacity: 0.55,
          textColor: '#F5F0E8',
        },
      },
      {
        id: 'text-1',
        type: 'text-centered',
        settings: {
          content:
            '<p>Will Sage exists at the intersection of music, meaning, and the magnificent mess of being human. His work is an invitation — to feel more, fear less, and show up as the fullest version of yourself.</p>',
          maxWidth: 'md',
          paddingTop: 'xl',
          paddingBottom: 'xl',
        },
      },
      {
        id: 'music-1',
        type: 'music-embed',
        settings: {
          embedUrl: 'https://open.spotify.com/embed/artist/placeholder',
          title: 'Latest Music',
          paddingTop: 'lg',
          paddingBottom: 'lg',
        },
      },
      {
        id: 'offering-1',
        type: 'offering-hero',
        settings: {
          backgroundImage: 'https://picsum.photos/seed/willsage-offering/1920/800',
          title: 'Soul Excavation Sessions',
          description:
            'A transformative 1:1 mentorship journey that goes beneath the surface — into the places where your truest creative voice lives.',
          ctaText: 'Learn More',
          ctaUrl: '/will-sage/offerings',
          overlayOpacity: 0.6,
          paddingTop: 'xl',
          paddingBottom: 'xl',
        },
      },
      {
        id: 'gallery-1',
        type: 'gallery-masonry',
        settings: {
          images: [
            { url: 'https://picsum.photos/seed/ws-g1/600/800', caption: '' },
            { url: 'https://picsum.photos/seed/ws-g2/600/400', caption: '' },
            { url: 'https://picsum.photos/seed/ws-g3/600/600', caption: '' },
            { url: 'https://picsum.photos/seed/ws-g4/600/900', caption: '' },
            { url: 'https://picsum.photos/seed/ws-g5/600/500', caption: '' },
            { url: 'https://picsum.photos/seed/ws-g6/600/700', caption: '' },
          ],
          columns: 3,
          showCaptions: false,
          paddingTop: 'lg',
          paddingBottom: 'lg',
        },
      },
      {
        id: 'testimonials-1',
        type: 'testimonial-quotes',
        settings: {
          quotes: [
            {
              text: 'Working with Will cracked me open in the best possible way. I left our sessions feeling more myself than I have in years.',
              author: 'Maya R.',
              title: 'Songwriter & Visual Artist',
            },
            {
              text: "Will's music doesn't just play — it heals. There's a medicine in every note he touches.",
              author: 'Jordan K.',
              title: 'Producer',
            },
            {
              text: "The Soul Excavation process showed me what I'd been hiding from myself. It changed everything.",
              author: 'Thea M.',
              title: 'Performer & Teacher',
            },
          ],
          paddingTop: 'xl',
          paddingBottom: 'xl',
        },
      },
      {
        id: 'cta-1',
        type: 'cta-banner',
        settings: {
          headline: 'Ready to begin?',
          subheadline: 'The next chapter of your creative life is waiting.',
          ctaText: 'Work with Will',
          ctaUrl: '/will-sage/offerings',
          backgroundColor: '#1A1815',
          textColor: '#F5F0E8',
          accentColor: '#C4892A',
          paddingTop: 'xl',
          paddingBottom: 'xl',
        },
      },
      {
        id: 'email-1',
        type: 'email-signup',
        settings: {
          headline: 'Letters from the edge of becoming',
          subheadline:
            'Occasional dispatches on music, meaning, and the creative life. No noise — only signal.',
          buttonText: 'Subscribe',
          placeholder: 'Your email address',
          paddingTop: 'xl',
          paddingBottom: 'xl',
        },
      },
    ]),
  },
  about: {
    title: 'About',
    slug: 'about',
    pageType: 'BIO',
    published: true,
    sections: JSON.stringify([
      {
        id: 'hero-about',
        type: 'hero-split',
        settings: {
          image: 'https://picsum.photos/seed/ws-about/800/1000',
          headline: 'About Will',
          subheadline: 'Musician. Performer. Producer. Soul Mentor.',
          imagePosition: 'right',
          overlayOpacity: 0,
          paddingTop: 'none',
          paddingBottom: 'none',
        },
      },
      {
        id: 'text-about',
        type: 'text-two-column',
        settings: {
          leftContent:
            '<p>Will Sage has spent two decades at the crossroads of music and meaning. Born from a lineage of storytellers, he came to music not as a career but as a calling — a way of making sense of the sacred chaos of being alive.</p><p>His sound defies easy categorization: part soul, part folk, part something that has no name yet. What remains constant is the depth. Every note Will plays carries the weight of real living — grief and joy, loss and becoming.</p>',
          rightContent:
            '<p>Beyond his work as a musician and producer, Will serves as a mentor and guide for artists navigating the terrain of creative identity. His Soul Excavation framework has helped hundreds of creators move past blocks, reclaim their voice, and build sustainable creative lives.</p><p>Will currently lives and works between the mountains and the sea, writing, recording, and holding space for the transformation that happens when we dare to get honest about what we really want to make.</p>',
          paddingTop: 'xl',
          paddingBottom: 'xl',
        },
      },
      {
        id: 'gallery-about',
        type: 'gallery-slider',
        settings: {
          images: [
            { url: 'https://picsum.photos/seed/ws-a1/800/600', caption: 'Live at The Loft' },
            { url: 'https://picsum.photos/seed/ws-a2/800/600', caption: 'Studio Session 2024' },
            { url: 'https://picsum.photos/seed/ws-a3/800/600', caption: 'Sound + Soul Retreat' },
            { url: 'https://picsum.photos/seed/ws-a4/800/600', caption: 'Writing in the Mountains' },
          ],
          showCaptions: true,
          paddingTop: 'lg',
          paddingBottom: 'xl',
        },
      },
    ]),
  },
  music: {
    title: 'Music',
    slug: 'music',
    pageType: 'MUSIC',
    published: true,
    sections: JSON.stringify([
      {
        id: 'hero-music',
        type: 'hero-fullwidth',
        settings: {
          backgroundImage: 'https://picsum.photos/seed/ws-music-hero/1920/1080',
          headline: 'The Music',
          subheadline: 'Songs from the soul of things.',
          overlayOpacity: 0.6,
          textColor: '#F5F0E8',
          paddingTop: 'none',
          paddingBottom: 'none',
        },
      },
      {
        id: 'music-featured',
        type: 'music-embed',
        settings: {
          embedUrl: 'https://open.spotify.com/embed/artist/placeholder',
          title: 'Featured Releases',
          description: 'Stream on Spotify',
          paddingTop: 'xl',
          paddingBottom: 'lg',
        },
      },
      {
        id: 'gallery-music',
        type: 'gallery-masonry',
        settings: {
          images: [
            { url: 'https://picsum.photos/seed/ws-m1/600/600', caption: 'Album Art — "Becoming"' },
            { url: 'https://picsum.photos/seed/ws-m2/600/800', caption: 'Press Photo 2024' },
            { url: 'https://picsum.photos/seed/ws-m3/600/600', caption: 'Album Art — "The Long Way Home"' },
            { url: 'https://picsum.photos/seed/ws-m4/600/500', caption: 'Live Performance' },
          ],
          columns: 2,
          showCaptions: true,
          paddingTop: 'lg',
          paddingBottom: 'xl',
        },
      },
    ]),
  },
  offerings: {
    title: 'Offerings',
    slug: 'offerings',
    pageType: 'OFFERINGS',
    published: true,
    sections: JSON.stringify([
      {
        id: 'hero-offerings',
        type: 'hero-fullwidth',
        settings: {
          backgroundImage: 'https://picsum.photos/seed/ws-offerings/1920/1080',
          headline: 'Transformative work for those ready to go deeper',
          subheadline: 'Choose your path.',
          overlayOpacity: 0.65,
          textColor: '#F5F0E8',
          paddingTop: 'none',
          paddingBottom: 'none',
        },
      },
      {
        id: 'offerings-grid',
        type: 'offering-card-grid',
        settings: {
          offerings: [
            {
              id: 'o1',
              title: 'Soul Excavation Sessions',
              description:
                'A transformative 1:1 mentorship journey. Six sessions over three months, designed to take you beneath the surface of your creative blocks and into the raw material of your most authentic work.',
              price: '$1,200',
              priceNote: '6-session package',
              image: 'https://picsum.photos/seed/ws-o1/600/400',
              ctaText: 'Apply Now',
              ctaUrl: '/will-sage/contact',
              badge: 'Most Popular',
            },
            {
              id: 'o2',
              title: 'Lantern Group Journey',
              description:
                'An 8-week group program for artists ready to build sustainable creative practices. Weekly calls, community support, and structured tools for breaking through creative resistance.',
              price: '$397',
              priceNote: '8-week program',
              image: 'https://picsum.photos/seed/ws-o2/600/400',
              ctaText: 'Join the Waitlist',
              ctaUrl: '/will-sage/contact',
              badge: 'Next cohort: Fall 2026',
            },
            {
              id: 'o3',
              title: 'Sound + Soul Retreat',
              description:
                'An immersive 4-day retreat where music, movement, and deep inner work converge. Limited to 12 participants. Set in the mountains, far from the noise of everyday life.',
              price: '$2,400',
              priceNote: 'All-inclusive',
              image: 'https://picsum.photos/seed/ws-o3/600/400',
              ctaText: 'Reserve Your Spot',
              ctaUrl: '/will-sage/contact',
              badge: 'Limited Availability',
            },
          ],
          paddingTop: 'xl',
          paddingBottom: 'xl',
        },
      },
      {
        id: 'testimonials-offerings',
        type: 'testimonial-quotes',
        settings: {
          quotes: [
            {
              text: 'The Soul Excavation process was the most transformative investment I\'ve ever made in my creative life. Worth every penny and then some.',
              author: 'Callie B.',
              title: 'Musician & Songwriter',
            },
            {
              text: 'I came to the retreat feeling like my creativity had dried up. I left with more ideas than I could hold — and a community I\'ll carry forever.',
              author: 'Derek V.',
              title: 'Producer & Composer',
            },
          ],
          paddingTop: 'xl',
          paddingBottom: 'xl',
        },
      },
      {
        id: 'cta-offerings',
        type: 'cta-banner',
        settings: {
          headline: 'Not sure where to start?',
          subheadline: 'Send a message and we\'ll find the right fit together.',
          ctaText: 'Get in Touch',
          ctaUrl: '/will-sage/contact',
          backgroundColor: '#1A1815',
          textColor: '#F5F0E8',
          accentColor: '#C4892A',
          paddingTop: 'xl',
          paddingBottom: 'xl',
        },
      },
    ]),
  },
  contact: {
    title: 'Contact',
    slug: 'contact',
    pageType: 'CONTACT',
    published: true,
    sections: JSON.stringify([
      {
        id: 'hero-contact',
        type: 'hero-fullwidth',
        settings: {
          backgroundImage: 'https://picsum.photos/seed/ws-contact/1920/600',
          headline: 'Let\'s Connect',
          subheadline: 'Every great collaboration starts with a conversation.',
          overlayOpacity: 0.7,
          textColor: '#F5F0E8',
          height: 'medium',
          paddingTop: 'none',
          paddingBottom: 'none',
        },
      },
      {
        id: 'contact-form',
        type: 'contact-form',
        settings: {
          fields: [
            { name: 'name', label: 'Name', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            {
              name: 'subject',
              label: 'Subject',
              type: 'select',
              options: ['General Inquiry', 'Soul Excavation Sessions', 'Lantern Group Journey', 'Sound + Soul Retreat', 'Booking / Performances', 'Press & Media'],
              required: true,
            },
            { name: 'message', label: 'Message', type: 'textarea', required: true },
          ],
          submitText: 'Send Message',
          successMessage: 'Thank you. I\'ll be in touch within 2-3 days.',
          recipientEmail: 'will@willsage.com',
          paddingTop: 'xl',
          paddingBottom: 'xl',
        },
      },
      {
        id: 'social-contact',
        type: 'social-links',
        settings: {
          links: [
            { platform: 'instagram', url: 'https://instagram.com/willsage', label: 'Instagram' },
            { platform: 'spotify', url: 'https://spotify.com/willsage', label: 'Spotify' },
            { platform: 'youtube', url: 'https://youtube.com/willsage', label: 'YouTube' },
          ],
          paddingTop: 'lg',
          paddingBottom: 'xl',
        },
      },
    ]),
  },
}

async function main() {
  console.log('🌱 Seeding database...')

  // Admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@creatorscircle.com' },
    update: {},
    create: {
      email: 'admin@creatorscircle.com',
      name: 'CC Admin',
      role: 'ADMIN',
      plan: 'PRO',
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Will Sage user
  const willSage = await prisma.user.upsert({
    where: { email: 'will@willsage.com' },
    update: {},
    create: {
      email: 'will@willsage.com',
      name: 'Will Sage',
      role: 'ARTIST',
      plan: 'PRO',
    },
  })

  // Will Sage artist profile
  const willProfile = await prisma.artistProfile.upsert({
    where: { userId: willSage.id },
    update: {},
    create: {
      userId: willSage.id,
      artistName: 'Will Sage',
      slug: 'will-sage',
      tagline: 'Musician. Creator. Soul Excavator.',
      bio: 'Will Sage exists at the intersection of music, meaning, and the magnificent mess of being human.',
      heroImageUrl: 'https://picsum.photos/seed/willsage-profile/800/800',
      sitePublished: true,
      siteTheme: 'sage-dark',
      socialLinks: JSON.stringify({
        instagram: 'https://instagram.com/willsage',
        spotify: 'https://open.spotify.com/artist/willsage',
        youtube: 'https://youtube.com/@willsage',
        bandcamp: 'https://willsage.bandcamp.com',
      }),
      seoTitle: 'Will Sage — Musician, Creator, Soul Excavator',
      seoDescription:
        'Will Sage is a musician, producer, and soul mentor. Explore his music, offerings, and work.',
    },
  })
  console.log('✅ Will Sage profile created:', willProfile.slug)

  // Nav links for Will Sage
  await prisma.navLink.deleteMany({ where: { profileId: willProfile.id } })
  await prisma.navLink.createMany({
    data: [
      { profileId: willProfile.id, label: 'Home', url: '/will-sage', order: 0 },
      { profileId: willProfile.id, label: 'About', url: '/will-sage/about', order: 1 },
      { profileId: willProfile.id, label: 'Music', url: '/will-sage/music', order: 2 },
      { profileId: willProfile.id, label: 'Offerings', url: '/will-sage/offerings', order: 3 },
      { profileId: willProfile.id, label: 'Contact', url: '/will-sage/contact', order: 4 },
    ],
  })

  // Will Sage pages
  for (const [key, page] of Object.entries(willSagePages)) {
    await prisma.sitePage.upsert({
      where: { profileId_slug: { profileId: willProfile.id, slug: page.slug } },
      update: { sections: page.sections, published: page.published },
      create: { profileId: willProfile.id, ...page },
    })
    console.log(`✅ Page created: ${page.title}`)
  }

  // Sample artists
  const artistData = [
    {
      email: 'luna@example.com',
      name: 'Luna Voss',
      slug: 'luna-voss',
      tagline: 'Electronic composer & visual artist',
    },
    {
      email: 'marcus@example.com',
      name: 'Marcus Osei',
      slug: 'marcus-osei',
      tagline: 'Afrobeat producer & DJ',
    },
    {
      email: 'jade@example.com',
      name: 'Jade Winters',
      slug: 'jade-winters',
      tagline: 'Folk singer-songwriter',
    },
  ]

  const sampleArtists = []
  for (const artist of artistData) {
    const user = await prisma.user.upsert({
      where: { email: artist.email },
      update: {},
      create: {
        email: artist.email,
        name: artist.name,
        role: 'ARTIST',
        plan: 'CREATOR',
      },
    })
    const profile = await prisma.artistProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        artistName: artist.name,
        slug: artist.slug,
        tagline: artist.tagline,
        heroImageUrl: `https://picsum.photos/seed/${artist.slug}/800/800`,
        sitePublished: true,
        siteTheme: 'sage-dark',
      },
    })
    sampleArtists.push({ user, profile })
    console.log(`✅ Artist created: ${artist.name}`)
  }

  // Sample lanterns
  const allUsers = [willSage, ...sampleArtists.map((a) => a.user)]
  const lanternSamples = [
    {
      title: 'New track dropping this Friday',
      body: 'Been in the studio for three weeks straight. Something is happening in there. I can feel it in my chest — that particular electricity that means you\'ve found the thing. Can\'t wait for you to hear it.',
      tags: JSON.stringify(['music', 'new-release', 'studio']),
    },
    {
      title: 'On creative blocks and what lives inside them',
      body: 'For a long time I thought creative blocks were problems to solve. Now I think they\'re invitations. Something in you knows you\'re not ready — and it\'s protecting you from making the thing before you have what you need to make it well.',
      tags: JSON.stringify(['creativity', 'process', 'reflection']),
    },
    {
      title: 'Photos from last night\'s show',
      body: 'What a room. What a night. Thank you to everyone who came out — you brought something with you that changed the energy of the whole set. This is why we do it.',
      imageUrl: 'https://picsum.photos/seed/show-1/800/500',
      tags: JSON.stringify(['live', 'performance', 'community']),
    },
    {
      title: 'Working through a new arrangement',
      body: 'Started with a simple chord progression and ended up somewhere completely unexpected. That\'s the thing about music — you set out for one shore and the current takes you somewhere better.',
      tags: JSON.stringify(['music', 'process', 'composition']),
    },
    {
      title: 'The retreat changed everything',
      body: 'Just got back from the mountains and I\'m still processing. There\'s a particular kind of silence you can only find when you\'re surrounded by a group of people all trying to get honest at the same time. I brought back three new songs and a completely different understanding of what I want to make.',
      tags: JSON.stringify(['retreat', 'reflection', 'growth']),
    },
    {
      title: 'Announcement: new cohort opening',
      body: 'The next Lantern Group Journey starts in June. Eight weeks of deep creative work, community, and support. If you\'ve been waiting for a sign — this is it. Link in bio.',
      tags: JSON.stringify(['offering', 'community', 'announcement']),
    },
    {
      title: 'Late night studio vibes',
      body: '2am. Coffee going cold. Something playing back that might be the best thing I\'ve ever made or complete nonsense — can\'t tell yet. This is the part nobody talks about.',
      imageUrl: 'https://picsum.photos/seed/studio-night/800/600',
      tags: JSON.stringify(['studio', 'process', 'music']),
    },
    {
      title: 'On the courage it takes to show up',
      body: 'Every time you put your work into the world, you\'re doing something that takes more courage than it looks like from the outside. Even if it\'s imperfect. Especially if it\'s imperfect. I see you.',
      tags: JSON.stringify(['creativity', 'reflection', 'community']),
    },
  ]

  await prisma.lantern.deleteMany({
    where: { userId: { in: allUsers.map((u) => u.id) } },
  })

  for (let i = 0; i < lanternSamples.length; i++) {
    const user = allUsers[i % allUsers.length]
    await prisma.lantern.create({
      data: {
        userId: user.id,
        ...lanternSamples[i],
        visibility: 'COMMUNITY',
      },
    })
  }
  console.log('✅ Sample lanterns created')

  // Programming events
  const now = new Date()
  const events = [
    {
      title: 'Monthly Circle — Creative Accountability',
      description:
        'A monthly gathering of Creators Circle members to share work, celebrate wins, and set intentions. Come ready to be seen and to witness.',
      startTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000),
      isVirtual: true,
      meetingUrl: 'https://zoom.us/placeholder',
      eventType: 'circle',
      capacity: 20,
    },
    {
      title: 'Workshop: Building Your Artist Site',
      description:
        'A hands-on workshop walking through the Creators Circle site builder. Bring questions. Leave with a published homepage.',
      startTime: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
      isVirtual: true,
      meetingUrl: 'https://zoom.us/placeholder',
      eventType: 'workshop',
      capacity: 30,
    },
    {
      title: 'Sound + Soul Retreat — Info Session',
      description:
        'An open Q&A session about the upcoming Sound + Soul Retreat. Learn what to expect, meet past participants, and find out if this is the right fit for you.',
      startTime: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
      isVirtual: true,
      meetingUrl: 'https://zoom.us/placeholder',
      eventType: 'session',
      capacity: 50,
    },
  ]

  await prisma.programmingEvent.deleteMany({})
  for (const event of events) {
    await prisma.programmingEvent.create({ data: event })
  }
  console.log('✅ Programming events created')

  console.log('\n🎉 Seed complete!')
  console.log('   Admin: admin@creatorscircle.com')
  console.log('   Will Sage: will@willsage.com')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

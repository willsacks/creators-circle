import Link from 'next/link'

export default function LandingPage() {
  const features = [
    {
      icon: '🎨',
      title: 'Your Artist Site',
      desc: 'Build a beautiful, customizable site that reflects your creative identity. No code required.',
    },
    {
      icon: '🏮',
      title: 'Lanterns',
      desc: 'Share project updates, process notes, and reflections with the community.',
    },
    {
      icon: '🎵',
      title: 'Community',
      desc: 'Connect with other artists. Get feedback. Witness and be witnessed.',
    },
    {
      icon: '📅',
      title: 'Programming',
      desc: 'Access workshops, circles, retreats, and events curated for your creative practice.',
    },
  ]

  const plans = [
    {
      name: 'Free',
      price: '$0',
      features: ['1 artist site (3 pages)', 'View community Lanterns', 'Basic themes'],
      cta: 'Get Started',
      href: '/login',
      highlight: false,
    },
    {
      name: 'Creator',
      price: '$29/mo',
      features: [
        'Unlimited pages',
        'Post & comment on Lanterns',
        'All themes',
        'Events & RSVPs',
        'Email integrations',
        'Custom domain',
      ],
      cta: 'Join as Creator',
      href: '/login',
      highlight: true,
    },
    {
      name: 'Pro',
      price: '$79/mo',
      features: [
        'Everything in Creator',
        'Priority support',
        'Analytics',
        'Multiple sites',
        'Early access',
      ],
      cta: 'Go Pro',
      href: '/login',
      highlight: false,
    },
  ]

  return (
    <div className="min-h-screen bg-cc-cream">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cc-cream/90 backdrop-blur border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-serif text-xl font-bold text-cc-dark">Creators Circle</span>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-stone-600 hover:text-cc-dark transition-colors">
              Sign In
            </Link>
            <Link
              href="/login"
              className="bg-cc-gold text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cc-gold-dark transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-cc-gold/10 text-cc-gold-dark text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            A home for working artists
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-cc-dark leading-tight mb-6">
            Your work deserves a{' '}
            <span className="text-cc-gold">real home.</span>
          </h1>
          <p className="text-stone-600 text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto mb-10">
            Creators Circle gives artists a beautiful site, a thriving community, and the tools to
            sustain their creative practice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="bg-cc-gold text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-cc-gold-dark transition-colors"
            >
              Start Building →
            </Link>
            <Link
              href="http://localhost:3001/will-sage"
              className="border border-stone-300 text-stone-700 px-8 py-4 rounded-xl text-lg font-medium hover:bg-stone-100 transition-colors"
            >
              See an Example Site
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-4xl text-center text-cc-dark mb-16">
            Everything you need to thrive as a creator
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f) => (
              <div key={f.title} className="p-6 rounded-2xl bg-cc-cream">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-serif text-xl font-bold text-cc-dark mb-2">{f.title}</h3>
                <p className="text-stone-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-4xl text-center text-cc-dark mb-4">Simple, honest pricing</h2>
          <p className="text-stone-600 text-center mb-16">Start free. Upgrade when you're ready.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 ${
                  plan.highlight
                    ? 'bg-cc-dark text-white ring-2 ring-cc-gold'
                    : 'bg-white border border-stone-200'
                }`}
              >
                <h3 className={`font-serif text-2xl font-bold mb-1 ${plan.highlight ? 'text-white' : 'text-cc-dark'}`}>
                  {plan.name}
                </h3>
                <p className={`text-3xl font-bold mb-6 ${plan.highlight ? 'text-cc-gold' : 'text-cc-dark'}`}>
                  {plan.price}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 text-sm ${plan.highlight ? 'text-stone-300' : 'text-stone-600'}`}>
                      <span className="text-cc-gold mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block text-center py-3 rounded-lg font-medium transition-colors ${
                    plan.highlight
                      ? 'bg-cc-gold text-white hover:bg-cc-gold-dark'
                      : 'border border-stone-300 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-serif text-lg font-bold text-cc-dark">Creators Circle</span>
          <p className="text-stone-500 text-sm">© 2026 Creators Circle. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

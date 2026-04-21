'use client'

import { Suspense, useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

const QUOTES = [
  { text: "Creativity is intelligence having fun.", author: "Albert Einstein" },
  { text: "Every artist was first an amateur.", author: "Ralph Waldo Emerson" },
  { text: "Art enables us to find ourselves and lose ourselves at the same time.", author: "Thomas Merton" },
  { text: "The purpose of art is washing the dust of daily life off our souls.", author: "Pablo Picasso" },
  { text: "Creativity takes courage.", author: "Henri Matisse" },
  { text: "You can't use up creativity. The more you use, the more you have.", author: "Maya Angelou" },
  { text: "Art is not what you see, but what you make others see.", author: "Edgar Degas" },
  { text: "The painter has the Universe in his mind and hands.", author: "Leonardo da Vinci" },
  { text: "To be an artist is to believe in life.", author: "Henry Moore" },
  { text: "Imagination is everything. It is the preview of life's coming attractions.", author: "Albert Einstein" },
  { text: "Art is the lie that enables us to realize the truth.", author: "Pablo Picasso" },
  { text: "The creative adult is the child who survived.", author: "Ursula K. Le Guin" },
  { text: "An artist is not paid for his labor but for his vision.", author: "James Whistler" },
  { text: "Every child is an artist. The problem is staying an artist when you grow up.", author: "Pablo Picasso" },
  { text: "Art washes away from the soul the dust of everyday life.", author: "Marc Chagall" },
  { text: "The world always seems brighter when you've just made something that wasn't there before.", author: "Neil Gaiman" },
  { text: "Inspiration exists, but it has to find you working.", author: "Pablo Picasso" },
  { text: "Great things are done by a series of small things brought together.", author: "Vincent van Gogh" },
  { text: "Art is not a handicraft, it is the transmission of feeling the artist has experienced.", author: "Leo Tolstoy" },
  { text: "The job of the artist is always to deepen the mystery.", author: "Francis Bacon" },
  { text: "Creativity is allowing yourself to make mistakes. Art is knowing which ones to keep.", author: "Scott Adams" },
  { text: "Life beats down and crushes the soul and art reminds you that you have one.", author: "Stella Adler" },
  { text: "To practice any art, no matter how well or badly, is a way to make your soul grow.", author: "Kurt Vonnegut" },
  { text: "Art is the stored honey of the human soul.", author: "Theodore Dreiser" },
  { text: "The arts are not a way to make a living. They are a very human way of making life more bearable.", author: "Kurt Vonnegut" },
  { text: "Without art, the crudeness of reality would make the world unbearable.", author: "George Bernard Shaw" },
  { text: "An artist must never be a prisoner. Prisoner? An artist should never be a prisoner of himself.", author: "Henri Matisse" },
  { text: "Colour is a power which directly influences the soul.", author: "Wassily Kandinsky" },
  { text: "I found I could say things with color and shapes that I couldn't say any other way.", author: "Georgia O'Keeffe" },
  { text: "The secret to creativity is knowing how to hide your sources.", author: "Albert Einstein" },
  { text: "Logic will get you from A to B. Imagination will take you everywhere.", author: "Albert Einstein" },
  { text: "Art is not a mirror to reflect reality, but a hammer with which to shape it.", author: "Bertolt Brecht" },
  { text: "Real painters understand with a brush in their hand.", author: "Berthe Morisot" },
  { text: "A work of art which did not begin in emotion is not art.", author: "Paul Cézanne" },
  { text: "When I am in my painting, I'm not aware of what I'm doing.", author: "Jackson Pollock" },
  { text: "All great art comes from a sense of outrage.", author: "Glenn Close" },
  { text: "The artist is the confidant of nature, flowers carry on dialogues with him through the graceful bending of their stems.", author: "Auguste Rodin" },
  { text: "The aim of art is to represent not the outward appearance of things, but their inward significance.", author: "Aristotle" },
  { text: "Creativity is seeing what everyone else has seen, and thinking what no one else has thought.", author: "Albert Einstein" },
  { text: "I dream my painting and I paint my dream.", author: "Vincent van Gogh" },
  { text: "The emotion of beauty is always obscured by the appearance of the unexpected.", author: "Jean-Auguste-Dominique Ingres" },
  { text: "There is no must in art because art is free.", author: "Wassily Kandinsky" },
  { text: "Only those who attempt the absurd will achieve the impossible.", author: "M. C. Escher" },
  { text: "Art is the only way to run away without leaving home.", author: "Twyla Tharp" },
  { text: "The artist sees what others only catch a glimpse of.", author: "Leonardo da Vinci" },
  { text: "Make visible what, without you, might perhaps never have been seen.", author: "Robert Bresson" },
  { text: "Art is not about thinking something up. It is about the opposite — getting something down.", author: "Julia Cameron" },
  { text: "The creative process is a process of surrender, not control.", author: "Julia Cameron" },
  { text: "Every artist dips his brush in his own soul, and paints his own nature into his pictures.", author: "Henry Ward Beecher" },
  { text: "Passion is one great force that unleashes creativity, because if you're passionate about something, then you're more willing to take risks.", author: "Yo-Yo Ma" },
]

function LoginContent() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [quote, setQuote] = useState(QUOTES[0])
  const searchParams = useSearchParams()
  const verify = searchParams.get('verify')

  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)])
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await signIn('resend', { email, callbackUrl: '/dashboard' })
    setLoading(false)
  }

  if (verify) {
    return (
      <div className="min-h-screen bg-cc-cream flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-5xl mb-6">📬</div>
          <h1 className="font-serif text-3xl text-cc-dark mb-4">Check your email</h1>
          <p className="text-stone-600 leading-relaxed">
            We sent a magic link to your email address. Click it to sign in. In development mode,
            check your terminal console.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cc-cream flex">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="max-w-md w-full">
          <a href="/" className="inline-block mb-10">
            <span className="font-serif text-2xl font-bold text-cc-dark">Creators Circle</span>
          </a>
          <h1 className="font-serif text-4xl text-cc-dark mb-3">Welcome back.</h1>
          <p className="text-stone-500 mb-8">
            Enter your email and we'll send you a magic link to sign in.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-white text-cc-dark placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-cc-gold transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cc-gold text-white py-3 rounded-xl font-medium hover:bg-cc-gold-dark disabled:opacity-60 transition-colors"
            >
              {loading ? 'Sending...' : 'Send Magic Link →'}
            </button>
          </form>
          <p className="text-stone-400 text-xs mt-6 text-center">
            No password needed. One click and you're in.
          </p>
        </div>
      </div>
      {/* Right: Quote panel */}
      <div
        className="hidden lg:flex flex-1 bg-cc-dark items-center justify-center relative overflow-hidden"
        style={{
          backgroundImage: "url('https://picsum.photos/seed/login-bg/900/1200')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-cc-dark/75" />
        <div className="relative z-10 text-center px-14 max-w-lg">
          <p className="font-serif text-3xl text-white leading-relaxed mb-6">
            &ldquo;{quote.text}&rdquo;
          </p>
          <p className="text-cc-gold text-sm tracking-widest uppercase">— {quote.author}</p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}

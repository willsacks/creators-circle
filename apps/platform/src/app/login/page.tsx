'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

function LoginContent() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const verify = searchParams.get('verify')

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
      {/* Right: Visual */}
      <div
        className="hidden lg:flex flex-1 bg-cc-dark items-center justify-center relative overflow-hidden"
        style={{
          backgroundImage: "url('https://picsum.photos/seed/login-bg/900/1200')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-cc-dark/70" />
        <div className="relative z-10 text-center px-12">
          <p className="font-serif text-3xl text-white leading-relaxed mb-6">
            "The work you make matters. You deserve a place to share it."
          </p>
          <p className="text-cc-gold text-sm tracking-widest uppercase">Creators Circle</p>
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

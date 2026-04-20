'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { CheckCircle } from 'lucide-react'

const plans = [
  {
    id: 'FREE',
    name: 'Free',
    price: '$0',
    period: '',
    features: ['1 artist site (3 pages max)', 'View community Lanterns', 'Basic site themes'],
  },
  {
    id: 'CREATOR',
    name: 'Creator',
    price: '$29',
    period: '/month',
    features: [
      'Unlimited pages',
      'Post & comment on Lanterns',
      'All themes',
      'Events & RSVPs',
      'Email integrations',
      'Custom domain',
    ],
  },
  {
    id: 'PRO',
    name: 'Pro',
    price: '$79',
    period: '/month',
    features: [
      'Everything in Creator',
      'Priority support',
      'Analytics',
      'Multiple sites',
      'Early access to features',
    ],
  },
]

export function BillingClient({ currentPlan }: { currentPlan: string }) {
  const [loading, setLoading] = useState<string | null>(null)

  async function handleUpgrade(planId: string) {
    setLoading(planId)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error('Failed to start checkout')
      }
    } catch {
      toast.error('Failed to start checkout')
    } finally {
      setLoading(null)
    }
  }

  async function handlePortal() {
    setLoading('portal')
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error('Failed to open billing portal')
      }
    } catch {
      toast.error('Failed to open billing portal')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold mb-2">Billing</h1>
        <p className="text-muted-foreground">
          You're currently on the <strong>{currentPlan}</strong> plan.
        </p>
      </div>

      {currentPlan !== 'FREE' && (
        <div className="bg-card border border-border rounded-2xl p-6 mb-8">
          <h2 className="font-serif text-xl font-bold mb-3">Manage Subscription</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Update your payment method, download invoices, or cancel your subscription through the Stripe billing portal.
          </p>
          <button
            onClick={handlePortal}
            disabled={loading === 'portal'}
            className="bg-cc-gold text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-cc-gold-dark transition-colors disabled:opacity-60"
          >
            {loading === 'portal' ? 'Loading...' : 'Open Billing Portal →'}
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlan
          const isUpgrade = ['FREE', 'CREATOR', 'PRO'].indexOf(plan.id) > ['FREE', 'CREATOR', 'PRO'].indexOf(currentPlan)

          return (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 border-2 ${
                isCurrent ? 'border-cc-gold bg-cc-gold/5' : 'border-border bg-card'
              }`}
            >
              {isCurrent && (
                <div className="flex items-center gap-1.5 text-cc-gold text-xs font-medium mb-3">
                  <CheckCircle size={14} /> Current plan
                </div>
              )}
              <h3 className="font-serif text-2xl font-bold mb-1">{plan.name}</h3>
              <p className="text-2xl font-bold mb-5">
                {plan.price}<span className="text-sm font-normal text-muted-foreground">{plan.period}</span>
              </p>
              <ul className="space-y-2.5 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle size={14} className="text-cc-gold shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              {!isCurrent && isUpgrade && plan.id !== 'FREE' && (
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={!!loading}
                  className="w-full py-2.5 bg-cc-gold text-white rounded-lg text-sm font-medium hover:bg-cc-gold-dark disabled:opacity-60 transition-colors"
                >
                  {loading === plan.id ? 'Loading...' : `Upgrade to ${plan.name}`}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@cc/db'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', { apiVersion: '2023-10-16' })

const PLAN_MAP: Record<string, 'FREE' | 'CREATOR' | 'PRO'> = {
  [process.env.STRIPE_CREATOR_PRICE_ID ?? '']: 'CREATOR',
  [process.env.STRIPE_PRO_PRICE_ID ?? '']: 'PRO',
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') ?? ''

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET ?? '')
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    if (session.mode === 'subscription' && session.customer) {
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
      const priceId = subscription.items.data[0]?.price.id ?? ''
      const plan = PLAN_MAP[priceId] ?? 'FREE'
      await prisma.user.updateMany({
        where: { stripeCustomerId: session.customer as string },
        data: { plan, stripeSubscriptionId: subscription.id },
      })
    }
  }

  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as Stripe.Subscription
    const priceId = subscription.items.data[0]?.price.id ?? ''
    const plan = PLAN_MAP[priceId] ?? 'FREE'
    await prisma.user.updateMany({
      where: { stripeCustomerId: subscription.customer as string },
      data: { plan, stripeSubscriptionId: subscription.id },
    })
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    await prisma.user.updateMany({
      where: { stripeCustomerId: subscription.customer as string },
      data: { plan: 'FREE', stripeSubscriptionId: null },
    })
  }

  return NextResponse.json({ received: true })
}

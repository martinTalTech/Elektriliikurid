import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', { apiVersion: '2024-06-20' })
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
)

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature!, Deno.env.get('STRIPE_WEBHOOK_SECRET') || '')
  } catch (err) {
    return new Response(`Webhook error: ${err.message}`, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent
    const listingId = paymentIntent.metadata.listing_id
    const plan = paymentIntent.metadata.plan || 'standard'
    const daysActive = plan === 'premium' ? 60 : 30
    const expiresAt = new Date(Date.now() + daysActive * 24 * 60 * 60 * 1000).toISOString()

    await supabase.from('listings').update({
      status: 'active',
      expires_at: expiresAt,
      payment_id: paymentIntent.id,
      featured: plan === 'premium',
    }).eq('id', listingId)

    await supabase.from('payments').insert({
      listing_id: listingId,
      amount: paymentIntent.amount / 100,
      stripe_payment_id: paymentIntent.id,
      status: 'succeeded',
      plan,
    })
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})

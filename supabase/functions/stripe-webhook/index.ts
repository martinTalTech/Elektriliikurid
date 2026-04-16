// deno-lint-ignore-file no-explicit-any
declare const Deno: { env: { get(key: string): string | undefined } }

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', { apiVersion: '2024-06-20' })
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
)

// Peab vastama create-checkout/index.ts PLANS objektile
const PLAN_DAYS: Record<string, number> = {
  basic:    30,
  standard: 60,
  premium:  90,
}

serve(async (req: Request) => {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()

  let event: Stripe.Event
  try {
    // deno-lint-ignore no-explicit-any
    event = stripe.webhooks.constructEvent(body, signature!, (Deno as any).env.get('STRIPE_WEBHOOK_SECRET') || '')
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Webhook signature verification failed:', message)
    return new Response(`Webhook error: ${message}`, { status: 400 })
  }

  // Stripe Checkout kasutab checkout.session.completed sündmust,
  // mitte payment_intent.succeeded — metadata on sessioonil
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const listingId = session.metadata?.listing_id
    const plan = session.metadata?.plan || 'standard'

    if (!listingId) {
      console.error('checkout.session.completed: listing_id puudub metadata\'s')
      return new Response(JSON.stringify({ received: true }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const daysActive = PLAN_DAYS[plan] ?? 30
    const expiresAt = new Date(Date.now() + daysActive * 24 * 60 * 60 * 1000).toISOString()

    // Loe kuulutuse user_id (vajalik maksekirje jaoks)
    const { data: listing } = await supabase
      .from('listings')
      .select('user_id')
      .eq('id', listingId)
      .single()

    // Aktiveeri kuulutus — .eq('status', 'pending_payment') väldib topelt-aktiveerimist
    const { error: updateError } = await supabase
      .from('listings')
      .update({
        status: 'active',
        expires_at: expiresAt,
        payment_id: session.payment_intent as string,
        featured: plan === 'premium',
      })
      .eq('id', listingId)
      .eq('status', 'pending_payment')

    if (updateError) {
      console.error('Listings update error:', updateError)
    }

    // Salvesta maksekirje koos user_id-ga (vajalik RLS "kasutaja näeb oma makseid" jaoks)
    const { error: insertError } = await supabase.from('payments').insert({
      listing_id: listingId,
      user_id: listing?.user_id ?? null,
      amount: session.amount_total ? session.amount_total / 100 : 0,
      stripe_payment_id: session.payment_intent as string,
      status: 'succeeded',
      plan,
    })

    if (insertError) {
      console.error('Payments insert error:', insertError)
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})

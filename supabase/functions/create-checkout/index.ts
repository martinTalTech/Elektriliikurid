// deno-lint-ignore-file no-explicit-any
declare const Deno: { env: { get(key: string): string | undefined } }

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2024-06-20',
})

// Service role client — kasutame ainult andmebaasi päringuteks (RLS bypass)
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
)

// Plaanid peavad vastama stripe-webhook/index.ts PLAN_DAYS objektile
const PLANS: Record<string, { amount: number; label: string; days: number }> = {
  basic:    { amount: 299,  label: 'Basic (30 päeva)',                  days: 30 },
  standard: { amount: 499,  label: 'Standard (60 päeva)',               days: 60 },
  premium:  { amount: 999,  label: 'Premium (90 päeva + esiletõstmine)', days: 90 },
}

// Lubatud päritolud (arendus + toodang)
const ALLOWED_ORIGINS = [
  'https://elektriliikurid.ee',
  'https://www.elektriliikurid.ee',
  'http://localhost:5173',
  'http://localhost:3000',
]

serve(async (req: Request) => {
  const origin = req.headers.get('origin') || ''
  const corsOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]

  const corsHeaders = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Kontrolli kasutaja JWT tokenit
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Autentimine nõutud' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const token = authHeader.replace('Bearer ', '')

    // Kasuta anon-key clienti, et kontrollida kasutaja JWT
    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_ANON_KEY') || '',
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    )
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser()

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Vigane või aegunud sessioon' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 2. Valideeri sisend
    const { listing_id, plan } = await req.json()

    if (!listing_id || !plan) {
      return new Response(JSON.stringify({ error: 'listing_id ja plan on kohustuslikud' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const planConfig = PLANS[plan]
    if (!planConfig) {
      return new Response(JSON.stringify({ error: 'Tundmatu pakett' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 3. Kontrolli, et kuulutus on olemas ja kuulub sellele kasutajale
    const { data: listing, error: listingError } = await supabaseAdmin
      .from('listings')
      .select('id, title, user_id, status')
      .eq('id', listing_id)
      .single()

    if (listingError || !listing) {
      return new Response(JSON.stringify({ error: 'Kuulutust ei leitud' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Turvakontroll: ainult kuulutuse omanik saab maksmist alustada
    if (listing.user_id !== user.id) {
      return new Response(JSON.stringify({ error: 'Ligipääs keelatud' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Topeltmakse kaitse: kui kuulutus on juba aktiivne, ei alusta uut makset
    if (listing.status === 'active') {
      return new Response(JSON.stringify({ error: 'Kuulutus on juba aktiivne' }), {
        status: 409,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 4. Loo Stripe Checkout sessioon
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `elektriliikurid.ee — ${planConfig.label}`,
              description: listing.title || 'Kuulutuse avaldamine',
            },
            unit_amount: planConfig.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/kuulutused/${listing_id}?makse=ok`,
      cancel_url: `${origin}/lisa-kuulutus?makse=katkestatud`,
      metadata: {
        listing_id,
        plan,
      },
    })

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('create-checkout error:', message)
    return new Response(JSON.stringify({ error: 'Serveri viga' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

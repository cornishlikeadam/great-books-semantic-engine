# The Great Books Semantic Engine

This repo now contains two layers:

- the original static prototype for GitHub Pages
- a new Next.js SaaS app scaffold for cloud LLM inference, login, usage metering, and billing

## Current app layers

- `index.html`, `styles.css`, `data.js`, `main.js`
  - the original static prototype
- `app/`, `components/`, `lib/`
  - the new Next.js cloud app
- `supabase/schema.sql`
  - required database tables for profiles and analysis usage

## What the cloud app supports

- user login and signup through Supabase
- first 3 analyses free after signup
- Stripe-ready subscription checkout and billing portal routes
- Together-hosted open-weight model integration
- 1-5 Western/Eastern passage pairs per prompt
- six explicit concept percentages:
  - self-cultivation
  - ultimate reality
  - grace
  - compassion
  - nature
  - virtue
- graph payloads tied to the exact analysis run

## Environment setup

Copy `.env.example` to `.env.local` and fill in:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `TOGETHER_API_KEY`
- `TOGETHER_CHAT_MODEL`
- `TOGETHER_EMBED_MODEL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_SCHOLAR_MONTHLY`
- `STRIPE_PRICE_LAB_MONTHLY`

## Supabase setup

1. Create a Supabase project.
2. Run the SQL in `supabase/schema.sql`.
3. Enable email/password auth.
4. Add your project URL, anon key, and service role key to `.env.local`.

## Stripe setup

1. Create two recurring prices in Stripe:
   - Scholar
   - Lab
2. Add those price IDs to `.env.local`.
3. Point a webhook at `/api/stripe/webhook`.
4. Add the webhook signing secret to `.env.local`.

## Together setup

1. Create a Together account and API key.
2. Add the key to `.env.local`.
3. The default models are:
   - `meta-llama/Llama-3.3-70B-Instruct-Turbo`
   - `intfloat/multilingual-e5-large-instruct`

## Local development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Deployment path

- Deploy the Next.js app to Vercel
- Add the same environment variables in Vercel
- Connect Stripe webhook to the deployed `/api/stripe/webhook`
- Keep GitHub Pages only if you want to preserve the static prototype separately

## Important note

If Supabase or Together keys are missing, the new app falls back gracefully:

- no-login mode if Supabase is missing
- local semantic analysis if Together is missing

That keeps development moving while you finish cloud configuration.

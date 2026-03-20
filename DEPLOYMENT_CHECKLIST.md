# Deployment Checklist

## Vercel

1. Log into Vercel CLI with `vercel login`.
2. Link or create the project with `vercel`.
3. Add all required environment variables to Vercel.
4. Deploy preview with `vercel`.
5. Deploy production with `vercel --prod`.

## Required environment variables

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

## Recommended environment variables

- `NEXT_PUBLIC_APP_URL`
  - Recommended for custom domains and explicit callback URLs.
  - The app can derive a preview URL automatically on Vercel if this is omitted.

## Supabase

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Enable email/password auth.
4. Copy project URL, anon key, and service role key.

## Together

1. Create a Together account.
2. Create an API key.
3. Add `TOGETHER_API_KEY` to Vercel.

## Stripe

1. Create two recurring prices:
   - Scholar monthly
   - Lab monthly
2. Copy the price IDs into Vercel env vars.
3. Set your webhook endpoint to:
   - `https://YOUR-VERCEL-DOMAIN/api/stripe/webhook`
4. Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.

## Validation

- Visit `/api/setup-status` on the deployed app.
- All feature flags should be `true`.
- Log in and confirm the account page loads.
- Run three analyses on the free tier.
- Start a subscription checkout and confirm the Stripe redirect works.

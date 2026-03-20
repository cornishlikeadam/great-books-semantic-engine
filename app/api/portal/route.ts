import { featureFlags, resolveAppUrl } from "@/lib/config";
import { getStripeClient } from "@/lib/billing/stripe";
import { getAuthenticatedUserFromRequest, ensureProfile } from "@/lib/usage/service";

export async function POST(request: Request) {
  if (!featureFlags.stripeEnabled) {
    return Response.json({ error: "Stripe is not configured yet." }, { status: 400 });
  }

  const user = await getAuthenticatedUserFromRequest(request);
  if (!user) {
    return Response.json({ error: "Login required." }, { status: 401 });
  }

  const stripe = getStripeClient();
  const profile = await ensureProfile(user);

  if (!stripe || !profile?.stripe_customer_id) {
    return Response.json({ error: "No billing customer found for this user." }, { status: 400 });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${resolveAppUrl(request)}/account`
  });

  return Response.json({ url: session.url });
}

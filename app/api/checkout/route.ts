import { z } from "zod";
import { appConfig, featureFlags, resolveAppUrl } from "@/lib/config";
import { getStripeClient } from "@/lib/billing/stripe";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  ensureProfile,
  getAuthenticatedUserFromRequest
} from "@/lib/usage/service";

const schema = z.object({
  plan: z.enum(["scholar", "lab"])
});

export async function POST(request: Request) {
  if (!featureFlags.stripeEnabled) {
    return Response.json({ error: "Stripe is not configured yet." }, { status: 400 });
  }

  const user = await getAuthenticatedUserFromRequest(request);
  if (!user) {
    return Response.json({ error: "Login required." }, { status: 401 });
  }

  const body = schema.parse(await request.json());
  const stripe = getStripeClient();
  const supabase = getSupabaseAdminClient();
  if (!stripe || !supabase) {
    return Response.json({ error: "Billing dependencies unavailable." }, { status: 500 });
  }

  const profile = await ensureProfile(user);

  let customerId = profile?.stripe_customer_id as string | null;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email || undefined,
      metadata: { userId: user.id }
    });
    customerId = customer.id;

    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId, updated_at: new Date().toISOString() })
      .eq("id", user.id);
  }

  const priceId =
    body.plan === "scholar"
      ? appConfig.stripePriceScholarMonthly
      : appConfig.stripePriceLabMonthly;
  const appUrl = resolveAppUrl(request);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/account?checkout=success`,
    cancel_url: `${appUrl}/pricing?checkout=cancelled`,
    metadata: {
      userId: user.id,
      plan: body.plan
    }
  });

  return Response.json({ url: session.url });
}

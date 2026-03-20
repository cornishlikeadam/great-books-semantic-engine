import { headers } from "next/headers";
import { appConfig } from "@/lib/config";
import { getStripeClient } from "@/lib/billing/stripe";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const stripe = getStripeClient();
  const supabase = getSupabaseAdminClient();
  const signature = (await headers()).get("stripe-signature");

  if (!stripe || !supabase || !signature || !appConfig.stripeWebhookSecret) {
    return new Response("Webhook not configured.", { status: 400 });
  }

  const body = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, appConfig.stripeWebhookSecret);
  } catch {
    return new Response("Invalid signature.", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan || "scholar";
    if (userId) {
      await supabase
        .from("profiles")
        .update({
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
          plan,
          subscription_status: "active",
          updated_at: new Date().toISOString()
        })
        .eq("id", userId);
    }
  }

  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const subscription = event.data.object;
    const status = subscription.status;
    const priceId = subscription.items.data[0]?.price?.id || null;
    const plan =
      priceId && priceId === appConfig.stripePriceLabMonthly
        ? "lab"
        : priceId && priceId === appConfig.stripePriceScholarMonthly
          ? "scholar"
          : "free";

    await supabase
      .from("profiles")
      .update({
        stripe_subscription_id: subscription.id,
        stripe_price_id: priceId,
        subscription_status: status,
        plan: status === "active" || status === "trialing" || status === "past_due" ? plan : "free",
        updated_at: new Date().toISOString()
      })
      .eq("stripe_customer_id", subscription.customer);
  }

  return new Response("ok");
}

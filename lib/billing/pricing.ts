import { cache } from "react";
import { getStripeClient } from "@/lib/billing/stripe";
import { appConfig } from "@/lib/config";
import { pricingPlans } from "@/lib/semantic/data";
import type { PricingPlan } from "@/lib/semantic/types";

function formatStripePrice(amount: number | null, currency: string, interval?: string | null) {
  if (amount === null) return "Configured in Stripe";

  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2
  }).format(amount);

  const suffix = interval ? `/${interval}` : "";
  return `${money}${suffix}`;
}

async function resolvePaidPlanPrice(planId: "scholar" | "lab") {
  const stripe = getStripeClient();
  const priceId =
    planId === "scholar" ? appConfig.stripePriceScholarMonthly : appConfig.stripePriceLabMonthly;

  if (!stripe || !priceId) {
    return planId === "scholar" ? "Scholar plan" : "Lab plan";
  }

  try {
    const price = await stripe.prices.retrieve(priceId);
    const amount =
      price.unit_amount_decimal !== null
        ? Number(price.unit_amount_decimal) / 100
        : price.unit_amount !== null
          ? price.unit_amount / 100
          : null;

    return formatStripePrice(amount, price.currency, price.recurring?.interval || null);
  } catch {
    return planId === "scholar" ? "Scholar plan" : "Lab plan";
  }
}

export const getDisplayPricingPlans = cache(async (): Promise<PricingPlan[]> => {
  const [scholarPrice, labPrice] = await Promise.all([
    resolvePaidPlanPrice("scholar"),
    resolvePaidPlanPrice("lab")
  ]);

  return pricingPlans.map((plan) => {
    if (plan.id === "scholar") {
      return { ...plan, price: scholarPrice };
    }

    if (plan.id === "lab") {
      return { ...plan, price: labPrice };
    }

    return plan;
  });
});

import { getDisplayPricingPlans } from "@/lib/billing/pricing";
import { PricingCards } from "@/components/auth/pricing-cards";

export default async function PricingPage() {
  const pricingPlans = await getDisplayPricingPlans();

  return (
    <main className="page-wrap">
      <section className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">Billing</p>
            <h1>Free first, then metered through subscriptions</h1>
          </div>
          <p className="supporting-copy">
            The app includes a three-analysis free tier after signup. Paid plan amounts are pulled
            live from the Stripe prices currently configured for this production deployment.
          </p>
        </div>

        <PricingCards plans={pricingPlans} />
      </section>
    </main>
  );
}

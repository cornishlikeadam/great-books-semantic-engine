import { PricingCards } from "@/components/auth/pricing-cards";

export default function PricingPage() {
  return (
    <main className="page-wrap">
      <section className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">Billing</p>
            <h1>Free first, then metered through subscriptions</h1>
          </div>
          <p className="supporting-copy">
            The app is set up for a three-analysis free tier after signup. Stripe takes over after
            that, using product price IDs you configure in the environment.
          </p>
        </div>

        <PricingCards />
      </section>
    </main>
  );
}

import Link from "next/link";
import { featureFlags } from "@/lib/config";
import {
  appMeta,
  heroStats,
  presets,
  pricingPlans,
  productCards
} from "@/lib/semantic/data";
import { SemanticWorkbench } from "@/components/semantic/workbench";

export default function HomePage() {
  return (
    <main>
      <section className="hero-section">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">SaaS edition</p>
            <h1>{appMeta.name}</h1>
            <p className="lede">{appMeta.tagline}</p>
            <p className="sublede">{appMeta.subtagline}</p>

            <div className="button-row">
              <Link href="#workbench" className="button primary">
                Run the engine
              </Link>
              <Link href="/pricing" className="button secondary">
                View pricing
              </Link>
            </div>

            <div className="banner-row">
              <div className="status-banner">
                <span className="pill">Auth</span>
                <p>{featureFlags.supabaseEnabled ? "Supabase login ready." : "Supabase envs not set yet."}</p>
              </div>
              <div className="status-banner">
                <span className="pill accent">LLM</span>
                <p>{featureFlags.togetherEnabled ? "Together cloud inference ready." : "Together key not set yet."}</p>
              </div>
            </div>

            <div className="stats-grid">
              {heroStats.map((stat) => (
                <article key={stat.label} className="stat-card">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </article>
              ))}
            </div>
          </div>

          <div className="hero-panel">
            <div className="card-topline">
              <span className="pill">What changes now</span>
            </div>
            <h2>From static prototype to login-gated cloud analysis</h2>
            <p>
              This version is structured for Vercel deployment, Supabase accounts, Stripe billing,
              Together-hosted open-weight models, and deterministic concept scoring.
            </p>
            <ul className="clean-list">
              <li>Prompt the engine and receive 1-5 matched passage pairs.</li>
              <li>See self-cultivation, ultimate reality, grace, compassion, nature, and virtue percentages.</li>
              <li>Get concise explanations for each pair and concept score.</li>
              <li>Inspect a graph payload tied to the exact analysis.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Product shape</p>
              <h2>The cloud engine you described</h2>
            </div>
          </div>

          <div className="card-grid four">
            {productCards.map((card) => (
              <article key={card.title} className="panel">
                <p className="eyebrow">{card.eyebrow}</p>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="workbench">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Workbench</p>
              <h2>Prompt, retrieve, explain, graph</h2>
            </div>
            <p className="supporting-copy">
              The workbench uses Together when configured and falls back to the local semantic
              engine while you finish wiring keys and cloud services.
            </p>
          </div>

          <SemanticWorkbench presets={presets} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Pricing gate</p>
              <h2>Free for the first three analyses, then paid plans</h2>
            </div>
          </div>

          <div className="card-grid three">
            {pricingPlans.map((plan) => (
              <article key={plan.id} className="panel">
                <p className="eyebrow">{plan.title}</p>
                <h3>{plan.price}</h3>
                <p>{plan.note}</p>
                <ul className="clean-list">
                  {plan.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <Link href={plan.id === "free" ? "/login" : "/pricing"} className="button secondary full">
                  {plan.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

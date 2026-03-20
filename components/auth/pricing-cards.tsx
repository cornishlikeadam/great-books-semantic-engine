"use client";

import { useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { pricingPlans } from "@/lib/semantic/data";

export function PricingCards() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [message, setMessage] = useState<string | null>(null);

  async function subscribe(plan: "scholar" | "lab") {
    if (!supabase) {
      setMessage("Supabase is not configured yet.");
      return;
    }

    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    if (!token) {
      setMessage("Sign in first so the subscription can be attached to your account.");
      return;
    }

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ plan })
    });
    const json = await response.json();
    if (!response.ok) {
      setMessage(json.error || "Could not create checkout.");
      return;
    }

    window.location.href = json.url;
  }

  return (
    <>
      <div className="card-grid three">
        {pricingPlans.map((plan) => (
          <article key={plan.id} className="panel">
            <p className="eyebrow">{plan.title}</p>
            <h2>{plan.price}</h2>
            <p>{plan.note}</p>
            <ul className="clean-list">
              {plan.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            {plan.id === "free" ? (
              <a href="/login" className="button secondary full">
                {plan.cta}
              </a>
            ) : (
              <button
                type="button"
                className="button primary full"
                onClick={() => subscribe(plan.id === "scholar" ? "scholar" : "lab")}
              >
                {plan.cta}
              </button>
            )}
          </article>
        ))}
      </div>
      {message ? <div className="status-banner">{message}</div> : null}
    </>
  );
}

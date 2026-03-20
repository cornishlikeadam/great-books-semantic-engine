"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

interface AccountPayload {
  email: string | null;
  plan: string;
  freeAnalysesUsed: number;
  remainingFreeQueries: number;
  recentEvents: Array<{
    id: number;
    prompt: string;
    total_tokens: number;
    provider_mode: string;
    created_at: string;
  }>;
}

export function AccountDashboard() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [payload, setPayload] = useState<AccountPayload | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!supabase) {
        setMessage("Supabase is not configured yet.");
        return;
      }

      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      if (!token) {
        setMessage("Login required.");
        return;
      }

      const response = await fetch("/api/account", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const json = await response.json();
      if (!response.ok) {
        setMessage(json.error || "Could not load account.");
        return;
      }

      setPayload(json);
      setActionMessage(null);
    }

    void load();
  }, [supabase]);

  async function openBillingPortal() {
    if (!supabase) return;
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return;

    const response = await fetch("/api/portal", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const json = await response.json();
    if (!response.ok) {
      setActionMessage(json.error || "Could not open the billing portal.");
      return;
    }

    setActionMessage(null);
    if (json.url) window.location.href = json.url;
  }

  async function signOut() {
    if (!supabase) return;

    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (message) {
    return (
      <div className="panel">
        <h2>{message}</h2>
        <Link href="/login" className="button secondary">
          Go to login
        </Link>
      </div>
    );
  }

  if (!payload) {
    return <div className="panel"><h2>Loading account...</h2></div>;
  }

  return (
    <div className="account-grid">
      <section className="panel">
        <p className="eyebrow">Account</p>
        <h2>{payload.email}</h2>
        <p>Plan: {formatPlan(payload.plan)}</p>
        <p>Free analyses used: {payload.freeAnalysesUsed}</p>
        <p>Free analyses remaining: {payload.remainingFreeQueries}</p>
        <div className="button-row compact">
          <Link href="/pricing" className="button secondary">
            Upgrade
          </Link>
          <button type="button" className="button secondary" onClick={openBillingPortal}>
            Open billing portal
          </button>
          <button type="button" className="button secondary" onClick={signOut}>
            Sign out
          </button>
        </div>
        {actionMessage ? <div className="status-banner">{actionMessage}</div> : null}
      </section>

      <section className="panel">
        <p className="eyebrow">Recent analyses</p>
        <div className="event-list">
          {payload.recentEvents.length ? (
            payload.recentEvents.map((event) => (
              <article key={event.id} className="event-card">
                <strong>{new Date(event.created_at).toLocaleString()}</strong>
                <p>{event.prompt}</p>
                <small>
                  {formatProviderMode(event.provider_mode)} · {event.total_tokens} tokens
                </small>
              </article>
            ))
          ) : (
            <p>No analyses recorded yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function formatPlan(plan: string) {
  if (!plan) return "Free";
  return plan.charAt(0).toUpperCase() + plan.slice(1);
}

function formatProviderMode(mode: string) {
  if (mode === "together") return "Together cloud";
  if (mode === "demo") return "Deterministic fallback";
  return mode;
}

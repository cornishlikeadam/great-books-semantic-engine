"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { AnalysisResult, Focus, PresetPrompt } from "@/lib/semantic/types";
import { GraphView } from "@/components/semantic/graph-view";

interface SemanticWorkbenchProps {
  presets: PresetPrompt[];
}

export function SemanticWorkbench({ presets }: SemanticWorkbenchProps) {
  const [prompt, setPrompt] = useState(presets[0]?.query || "");
  const [focus, setFocus] = useState<Focus>(presets[0]?.focus || "western");
  const [depth, setDepth] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [authResolved, setAuthResolved] = useState(false);

  const supabaseConfigured = useMemo(() => Boolean(getSupabaseBrowserClient()), []);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setAccessToken(data.session?.access_token || null);
      setUserEmail(data.session?.user?.email || null);
      setAuthResolved(true);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAccessToken(session?.access_token || null);
      setUserEmail(session?.user?.email || null);
      setAuthResolved(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function runAnalysis(nextPrompt = prompt, nextFocus = focus, nextDepth = depth) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify({
          prompt: nextPrompt,
          focus: nextFocus,
          depth: nextDepth
        })
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Analysis failed");
      }

      setResult(payload);
    } catch (analysisError) {
      setError(analysisError instanceof Error ? analysisError.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!supabaseConfigured) {
      void runAnalysis();
      return;
    }

    if (!authResolved) return;
    if (accessToken) {
      void runAnalysis();
    }
  }, [accessToken, authResolved, supabaseConfigured]);

  return (
    <div className="workbench-grid">
      <aside className="workbench-panel">
        <div className="status-card">
          <span className="pill">{supabaseConfigured ? "Login enabled" : "Demo mode"}</span>
          <p>
            {userEmail
              ? `Signed in as ${userEmail}.`
              : supabaseConfigured
                ? "Sign in to unlock your three free cloud analyses."
                : "Supabase is not configured yet, so the app is running in local demo mode."}
          </p>
          <div className="button-row compact">
            <Link href={userEmail ? "/account" : "/login"} className="button secondary">
              {userEmail ? "Open account" : "Login / signup"}
            </Link>
            <Link href="/pricing" className="button secondary">
              Pricing
            </Link>
          </div>
        </div>

        <form
          className="query-form"
          onSubmit={(event) => {
            event.preventDefault();
            void runAnalysis();
          }}
        >
          <label className="field">
            <span>Research prompt</span>
            <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={6} />
          </label>

          <div className="field-row">
            <label className="field">
              <span>Primary corpus</span>
              <select value={focus} onChange={(event) => setFocus(event.target.value as Focus)}>
                <option value="western">Western</option>
                <option value="eastern">Eastern</option>
                <option value="all">Both</option>
              </select>
            </label>

            <label className="field">
              <span>Pairs returned</span>
              <select value={depth} onChange={(event) => setDepth(Number(event.target.value))}>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </label>
          </div>

          <div className="preset-grid">
            {presets.map((preset) => (
              <button
                key={preset.title}
                type="button"
                className="preset-button"
                onClick={() => {
                  setPrompt(preset.query);
                  setFocus(preset.focus);
                  void runAnalysis(preset.query, preset.focus, depth);
                }}
              >
                {preset.title}
              </button>
            ))}
          </div>

          <button type="submit" className="button primary full" disabled={loading}>
            {loading ? "Analyzing..." : "Run analysis"}
          </button>
        </form>

        {error ? <div className="error-box">{error}</div> : null}
      </aside>

      <section className="results-panel">
        {result ? (
          <>
            <div className="summary-panel">
              <div className="card-topline">
                <span className="pill">{result.provider.mode === "together" ? "Cloud model" : "Local fallback"}</span>
                <span className="tiny">
                  {result.provider.chatModel || "deterministic semantic engine"}
                </span>
              </div>
              <h2>{result.summary}</h2>
              <div className="stats-grid compact">
                <article className="stat-card">
                  <strong>{result.pairs.length}</strong>
                  <span>pairs</span>
                </article>
                <article className="stat-card">
                  <strong>{result.usage.totalTokens}</strong>
                  <span>tokens</span>
                </article>
                <article className="stat-card">
                  <strong>{result.usage.remainingFreeQueries ?? "n/a"}</strong>
                  <span>free queries left</span>
                </article>
              </div>
            </div>

            <div className="metric-grid">
              {result.metrics.map((metric) => (
                <article key={metric.id} className="metric-card" style={{ borderTopColor: metric.color }}>
                  <div className="metric-head">
                    <span>{metric.label}</span>
                    <strong>{metric.percentage}%</strong>
                  </div>
                  <p>{metric.explanation}</p>
                </article>
              ))}
            </div>

            <div className="pair-list">
              {result.pairs.map((pair) => (
                <article key={`${pair.primary.id}-${pair.counterpart.id}`} className="pair-card">
                  <div className="pair-title">
                    <h3>
                      {pair.primary.author} ⇄ {pair.counterpart.author}
                    </h3>
                    <span className="pill accent">{Math.round(pair.counterpartScore * 100)}% fit</span>
                  </div>

                  <p className="pair-copy">{pair.explanation}</p>

                  <div className="pair-columns">
                    <div className="passage-card western">
                      <span className="pill">Primary</span>
                      <h4>
                        {pair.primary.author} · {pair.primary.work}
                      </h4>
                      <p className="meta">{pair.primary.section}</p>
                      {pair.primary.original ? <p className="original">{pair.primary.original}</p> : null}
                      <p>{pair.primary.translation}</p>
                    </div>
                    <div className="passage-card eastern">
                      <span className="pill accent">Counterpart</span>
                      <h4>
                        {pair.counterpart.author} · {pair.counterpart.work}
                      </h4>
                      <p className="meta">{pair.counterpart.section}</p>
                      {pair.counterpart.original ? <p className="original">{pair.counterpart.original}</p> : null}
                      <p>{pair.counterpart.translation}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="graph-panel">
              <div className="section-head inline">
                <div>
                  <p className="eyebrow">Analysis graph</p>
                  <h3>Author-to-metric edges for this exact run</h3>
                </div>
              </div>
              <GraphView nodes={result.graph.nodes} edges={result.graph.edges} />
            </div>
          </>
        ) : (
          <div className="summary-panel">
            <h2>Run an analysis to see pairs, percentages, and graph output.</h2>
          </div>
        )}
      </section>
    </div>
  );
}

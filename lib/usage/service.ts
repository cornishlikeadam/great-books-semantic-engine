import type { User } from "@supabase/supabase-js";
import { featureFlags } from "@/lib/config";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const FREE_ANALYSIS_LIMIT = 3;

export interface UsageStatus {
  plan: string;
  freeAnalysesUsed: number;
  remainingFreeQueries: number;
  canAnalyze: boolean;
  stripeCustomerId: string | null;
  subscriptionStatus: string | null;
}

export async function getAuthenticatedUserFromRequest(request: Request) {
  if (!featureFlags.supabaseEnabled) return null;

  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return null;

  const supabase = getSupabaseAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getUser(token);
  if (error) return null;
  return data.user;
}

export async function ensureProfile(user: User) {
  if (!featureFlags.supabaseEnabled) return null;
  const supabase = getSupabaseAdminClient();
  if (!supabase) return null;

  const { data: existing } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) return existing;

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      email: user.email,
      plan: "free",
      free_analyses_used: 0,
      subscription_status: "inactive"
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function getUsageStatus(user: User): Promise<UsageStatus> {
  if (!featureFlags.supabaseEnabled) {
    return {
      plan: "demo",
      freeAnalysesUsed: 0,
      remainingFreeQueries: FREE_ANALYSIS_LIMIT,
      canAnalyze: true,
      stripeCustomerId: null,
      subscriptionStatus: null
    };
  }

  const profile = await ensureProfile(user);
  const freeAnalysesUsed = profile?.free_analyses_used || 0;
  const plan = profile?.plan || "free";
  const subscriptionStatus = profile?.subscription_status || "inactive";
  const isPaidAndActive =
    plan !== "free" && ["active", "trialing", "past_due"].includes(subscriptionStatus);
  const remainingFreeQueries = Math.max(0, FREE_ANALYSIS_LIMIT - freeAnalysesUsed);

  return {
    plan,
    freeAnalysesUsed,
    remainingFreeQueries,
    canAnalyze: isPaidAndActive || remainingFreeQueries > 0,
    stripeCustomerId: profile?.stripe_customer_id || null,
    subscriptionStatus
  };
}

export async function recordAnalysisUsage(params: {
  user: User;
  prompt: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  providerMode: string;
}) {
  if (!featureFlags.supabaseEnabled) return;
  const supabase = getSupabaseAdminClient();
  if (!supabase) return;

  const profile = await ensureProfile(params.user);
  const plan = profile?.plan || "free";

  await supabase.from("analysis_events").insert({
    user_id: params.user.id,
    prompt: params.prompt,
    prompt_tokens: params.promptTokens,
    completion_tokens: params.completionTokens,
    total_tokens: params.totalTokens,
    provider_mode: params.providerMode
  });

  if (plan === "free") {
    await supabase
      .from("profiles")
      .update({
        free_analyses_used: (profile?.free_analyses_used || 0) + 1,
        updated_at: new Date().toISOString()
      })
      .eq("id", params.user.id);
  }
}

export async function getAccountSnapshot(user: User) {
  if (!featureFlags.supabaseEnabled) {
    return {
      email: user.email,
      plan: "demo",
      freeAnalysesUsed: 0,
      remainingFreeQueries: FREE_ANALYSIS_LIMIT,
      recentEvents: []
    };
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) return null;
  const usage = await getUsageStatus(user);

  const { data: recentEvents } = await supabase
    .from("analysis_events")
    .select("id, prompt, total_tokens, provider_mode, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(8);

  return {
    email: user.email,
    plan: usage.plan,
    freeAnalysesUsed: usage.freeAnalysesUsed,
    remainingFreeQueries: usage.remainingFreeQueries,
    recentEvents: recentEvents || []
  };
}

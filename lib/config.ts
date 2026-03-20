export function getEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim().length ? value.trim() : undefined;
}

function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

export function resolveAppUrl(request?: Request): string {
  const explicit = getEnv("NEXT_PUBLIC_APP_URL");
  if (explicit) {
    return normalizeUrl(explicit);
  }

  const vercelProductionUrl = getEnv("VERCEL_PROJECT_PRODUCTION_URL");
  if (vercelProductionUrl) {
    return normalizeUrl(
      vercelProductionUrl.startsWith("http")
        ? vercelProductionUrl
        : `https://${vercelProductionUrl}`
    );
  }

  const vercelUrl = getEnv("VERCEL_URL");
  if (vercelUrl) {
    return normalizeUrl(vercelUrl.startsWith("http") ? vercelUrl : `https://${vercelUrl}`);
  }

  if (request) {
    const forwardedProto = request.headers.get("x-forwarded-proto");
    const forwardedHost = request.headers.get("x-forwarded-host");
    const host = forwardedHost || request.headers.get("host");
    if (host) {
      return normalizeUrl(`${forwardedProto || "https"}://${host}`);
    }
  }

  return "http://localhost:3000";
}

export const appConfig = {
  appUrl: resolveAppUrl(),
  supabaseUrl: getEnv("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  supabaseServiceRoleKey: getEnv("SUPABASE_SERVICE_ROLE_KEY"),
  togetherApiKey: getEnv("TOGETHER_API_KEY"),
  togetherChatModel:
    getEnv("TOGETHER_CHAT_MODEL") || "meta-llama/Llama-3.3-70B-Instruct-Turbo",
  togetherEmbedModel:
    getEnv("TOGETHER_EMBED_MODEL") || "intfloat/multilingual-e5-large-instruct",
  stripeSecretKey: getEnv("STRIPE_SECRET_KEY"),
  stripeWebhookSecret: getEnv("STRIPE_WEBHOOK_SECRET"),
  stripePriceScholarMonthly: getEnv("STRIPE_PRICE_SCHOLAR_MONTHLY"),
  stripePriceLabMonthly: getEnv("STRIPE_PRICE_LAB_MONTHLY")
};

export const featureFlags = {
  supabaseEnabled: Boolean(
    appConfig.supabaseUrl && appConfig.supabaseAnonKey && appConfig.supabaseServiceRoleKey
  ),
  togetherEnabled: Boolean(appConfig.togetherApiKey),
  stripeEnabled: Boolean(
    appConfig.stripeSecretKey &&
      appConfig.stripeWebhookSecret &&
      appConfig.stripePriceScholarMonthly &&
      appConfig.stripePriceLabMonthly
  )
};

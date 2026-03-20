export function readEnv(value: string | undefined): string | undefined {
  return value && value.trim().length ? value.trim() : undefined;
}

function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

export function resolveAppUrl(request?: Request): string {
  const explicit = readEnv(process.env.NEXT_PUBLIC_APP_URL);
  if (explicit) {
    return normalizeUrl(explicit);
  }

  const vercelProductionUrl = readEnv(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  if (vercelProductionUrl) {
    return normalizeUrl(
      vercelProductionUrl.startsWith("http")
        ? vercelProductionUrl
        : `https://${vercelProductionUrl}`
    );
  }

  const vercelUrl = readEnv(process.env.VERCEL_URL);
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
  supabaseUrl: readEnv(process.env.NEXT_PUBLIC_SUPABASE_URL),
  supabaseAnonKey: readEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  supabaseServiceRoleKey: readEnv(process.env.SUPABASE_SERVICE_ROLE_KEY),
  togetherApiKey: readEnv(process.env.TOGETHER_API_KEY),
  togetherChatModel:
    readEnv(process.env.TOGETHER_CHAT_MODEL) || "meta-llama/Llama-3.3-70B-Instruct-Turbo",
  togetherEmbedModel:
    readEnv(process.env.TOGETHER_EMBED_MODEL) || "intfloat/multilingual-e5-large-instruct",
  stripeSecretKey: readEnv(process.env.STRIPE_SECRET_KEY),
  stripeWebhookSecret: readEnv(process.env.STRIPE_WEBHOOK_SECRET),
  stripePriceScholarMonthly: readEnv(process.env.STRIPE_PRICE_SCHOLAR_MONTHLY),
  stripePriceLabMonthly: readEnv(process.env.STRIPE_PRICE_LAB_MONTHLY)
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

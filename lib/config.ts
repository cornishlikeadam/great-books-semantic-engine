export function getEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim().length ? value.trim() : undefined;
}

export const appConfig = {
  appUrl: getEnv("NEXT_PUBLIC_APP_URL") || "http://localhost:3000",
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
      appConfig.stripePriceScholarMonthly &&
      appConfig.stripePriceLabMonthly
  )
};

import { appConfig, featureFlags, resolveAppUrl } from "@/lib/config";

export async function GET(request: Request) {
  return Response.json({
    appUrl: resolveAppUrl(request),
    flags: featureFlags,
    missing: {
      appUrl: appConfig.appUrl === "http://localhost:3000" ? ["NEXT_PUBLIC_APP_URL"] : [],
      supabase: featureFlags.supabaseEnabled
        ? []
        : [
            "NEXT_PUBLIC_SUPABASE_URL",
            "NEXT_PUBLIC_SUPABASE_ANON_KEY",
            "SUPABASE_SERVICE_ROLE_KEY"
          ],
      together: featureFlags.togetherEnabled ? [] : ["TOGETHER_API_KEY"],
      stripe: featureFlags.stripeEnabled
        ? []
        : [
            "STRIPE_SECRET_KEY",
            "STRIPE_WEBHOOK_SECRET",
            "STRIPE_PRICE_SCHOLAR_MONTHLY",
            "STRIPE_PRICE_LAB_MONTHLY"
          ]
    }
  });
}

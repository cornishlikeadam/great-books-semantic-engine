import { createClient } from "@supabase/supabase-js";
import { appConfig, featureFlags } from "@/lib/config";

export function getSupabaseAdminClient() {
  if (!featureFlags.supabaseEnabled) return null;

  return createClient(appConfig.supabaseUrl!, appConfig.supabaseServiceRoleKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

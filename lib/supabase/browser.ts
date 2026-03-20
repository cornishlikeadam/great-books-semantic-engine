import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { appConfig, featureFlags } from "@/lib/config";

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient() {
  if (!featureFlags.supabaseEnabled) return null;
  if (!browserClient) {
    browserClient = createClient(appConfig.supabaseUrl!, appConfig.supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
  }

  return browserClient;
}

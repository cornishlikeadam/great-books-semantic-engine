import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { appConfig } from "@/lib/config";

let browserClient: SupabaseClient | null = null;

export function isSupabaseBrowserConfigured() {
  return Boolean(appConfig.supabaseUrl && appConfig.supabaseAnonKey);
}

export function getSupabaseBrowserClient() {
  if (!isSupabaseBrowserConfigured()) return null;
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

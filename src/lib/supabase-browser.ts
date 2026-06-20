import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type GlobalWithClient = typeof globalThis & {
  __supabaseBrowserClient?: SupabaseClient;
};

const globalStore = globalThis as GlobalWithClient;

/**
 * Browser singleton — created once and cached on globalThis so it survives
 * Next.js dev hot-reloads (which reset module state and would otherwise spin up
 * a second GoTrueClient under the same storage key, producing the
 * "Multiple GoTrueClient instances detected" warning).
 */
export function getSupabaseBrowserClient(): SupabaseClient {
  if (!globalStore.__supabaseBrowserClient) {
    globalStore.__supabaseBrowserClient = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        auth: { persistSession: true, autoRefreshToken: true },
      }
    );
  }
  return globalStore.__supabaseBrowserClient;
}

/**
 * Server-side client factory. Each call returns a fresh client so requests stay
 * isolated. Never import this from a Client Component — use getSupabaseBrowserClient.
 */
export function getSupabaseServerClient(): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Shared browser client instance. Import this in Client Components only. */
export const supabase = getSupabaseBrowserClient();

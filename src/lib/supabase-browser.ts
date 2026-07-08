import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

type GlobalWithClient = typeof globalThis & {
  __supabaseBrowserClient?: SupabaseClient;
};

const globalStore = globalThis as GlobalWithClient;

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

export function getSupabaseServerClient(): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function getSupabaseAdminClient(): SupabaseClient {
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const supabase = getSupabaseBrowserClient();

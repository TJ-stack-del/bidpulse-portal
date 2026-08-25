import { createBrowserClient } from '@supabase/ssr';
import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';

function getValidConfig() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  let url = 'https://placeholder-project.supabase.co';

  if (rawUrl && typeof rawUrl === 'string' && (rawUrl.startsWith('http://') || rawUrl.startsWith('https://'))) {
    url = rawUrl;
  }

  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
  return { url, anonKey };
}

export function createClient() {
  const { url, anonKey } = getValidConfig();
  return createBrowserClient(url, anonKey);
}

export function getSupabase() {
  const { url, anonKey } = getValidConfig();
  return createBrowserClient(url, anonKey);
}

// Lazy singleton proxy: avoids creating the client during build module evaluation
let _client: SupabaseClient | null = null;
function getLazyClient(): SupabaseClient {
  if (!_client) {
    const { url, anonKey } = getValidConfig();
    _client = createSupabaseClient(url, anonKey);
  }
  return _client;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop: string | symbol) {
    const instance = getLazyClient();
    const value = (instance as any)[prop];
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  },
});

export default getSupabase;
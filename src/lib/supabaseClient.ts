import { createBrowserClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Fallback singleton for legacy imports
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);
import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://xqltmahfnspnhyofdwto.supabase.co";

  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder";

  const validUrl = url.startsWith("http")
    ? url
    : "https://xqltmahfnspnhyofdwto.supabase.co";

  return createClient(validUrl, key);
}

export const supabase = getSupabaseClient();

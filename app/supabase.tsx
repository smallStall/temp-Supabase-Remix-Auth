import { createClient } from "@supabase/supabase-js";

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  fetch: (...args) => fetch(...args),
});

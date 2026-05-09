import { createClient } from "@supabase/supabase-js";
import { cache } from "react";
import type { Database } from "./types";

// Uses the anon key only — safe to call from Server Components.
// The anon key is restricted by Row Level Security policies defined in the database.
// Never import the service_role key here; admin operations must go through
// Supabase Edge Functions or a separate secured backend route.
export const createServerSupabaseClient = cache(() =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // Server components do not persist sessions in browser storage
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  )
);

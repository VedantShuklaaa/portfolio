import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";
import {
	isSupabaseConfigured,
	SUPABASE_PUBLISHABLE_KEY,
	SUPABASE_URL,
} from "@/lib/supabase/env";

/**
 * Anonymous, cookie-less client for public reads. RLS limits it to published
 * articles, so it is safe to use for anything a visitor can already see.
 */
export function createSupabasePublicClient(): SupabaseClient<Database> {
	if (!isSupabaseConfigured()) {
		throw new Error("Supabase is not configured");
	}

	return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
		auth: {
			persistSession: false,
			autoRefreshToken: false,
			detectSessionInUrl: false,
		},
	});
}

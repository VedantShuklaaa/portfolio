"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";
import {
	isSupabaseConfigured,
	SUPABASE_PUBLISHABLE_KEY,
	SUPABASE_URL,
} from "@/lib/supabase/env";

/**
 * Browser client for the admin sign-in form only. It stores the session in
 * cookies that the server reads on subsequent requests.
 */
export function createSupabaseBrowserClient(): SupabaseClient<Database> {
	if (!isSupabaseConfigured()) {
		throw new Error("Supabase is not configured");
	}

	return createBrowserClient<Database>(
		SUPABASE_URL,
		SUPABASE_PUBLISHABLE_KEY,
	);
}

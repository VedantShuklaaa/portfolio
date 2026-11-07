import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import type { Database } from "@/lib/supabase/database.types";
import {
	isSupabaseConfigured,
	SUPABASE_PUBLISHABLE_KEY,
	SUPABASE_URL,
} from "@/lib/supabase/env";

/**
 * Cookie-bound client. Every query and storage operation runs with the
 * signed-in user's JWT, so RLS — not application code alone — enforces who can
 * read or write an article.
 */
export async function createSupabaseServerClient(): Promise<
	SupabaseClient<Database>
> {
	if (!isSupabaseConfigured()) {
		throw new Error("Supabase is not configured");
	}

	const cookieStore = await cookies();

	return createServerClient<Database>(
		SUPABASE_URL,
		SUPABASE_PUBLISHABLE_KEY,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						for (const { name, value, options } of cookiesToSet) {
							cookieStore.set(name, value, options);
						}
					} catch {
						// Server Components cannot mutate cookies. The proxy
						// refreshes the session for admin routes instead.
					}
				},
			},
		},
	);
}

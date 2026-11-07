import type { SupabaseClient, User } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminContext = {
	user: User;
	supabase: SupabaseClient<Database>;
};

function adminUserIds(): Set<string> {
	const raw = process.env.ADMIN_USER_IDS ?? "";
	return new Set(
		raw
			.split(",")
			.map((value) => value.trim().toLowerCase())
			.filter(Boolean),
	);
}

export function isAdminUserId(userId: string): boolean {
	return adminUserIds().has(userId.toLowerCase());
}

/**
 * Verify the session with Supabase Auth on every call and then apply the
 * server-side allowlist. Client-supplied roles or ids are never read.
 */
export async function getAdminContext(): Promise<AdminContext | null> {
	if (!isSupabaseConfigured()) return null;

	const supabase = await createSupabaseServerClient();
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error || !user) return null;
	if (!isAdminUserId(user.id)) return null;

	return { user, supabase };
}

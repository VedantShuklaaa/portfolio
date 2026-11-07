import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import {
	isSupabaseConfigured,
	SUPABASE_PUBLISHABLE_KEY,
	SUPABASE_URL,
} from "@/lib/supabase/env";

const ADMIN_PATH = /^\/(?:admin|api\/admin)(?:\/|$)/;
const ARTICLE_PATH = /^\/writings\/([^/]+)\/?$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Unmatched path that renders the root not-found boundary. */
const NOT_FOUND_PATH = "/__not_found__";

type Existence = "published" | "missing" | "unknown";

/**
 * Cache Components streams a 200 shell before the article page can call
 * notFound(). Checking the slug here keeps missing and unpublished articles at
 * a real 404 status. Network failures are "unknown" so the page can render its
 * normal error state instead of a false 404.
 */
async function publishedSlugExists(slug: string): Promise<Existence> {
	if (!SLUG_PATTERN.test(slug)) return "missing";

	try {
		const query = new URLSearchParams({
			select: "slug",
			status: "eq.published",
			slug: `eq.${slug}`,
			limit: "1",
		});
		const response = await fetch(
			`${SUPABASE_URL}/rest/v1/articles?${query.toString()}`,
			{
				headers: {
					apikey: SUPABASE_PUBLISHABLE_KEY,
					Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
				},
				cache: "no-store",
			},
		);

		if (!response.ok) return "unknown";

		const rows: unknown = await response.json();
		if (!Array.isArray(rows)) return "unknown";
		return rows.length > 0 ? "published" : "missing";
	} catch {
		return "unknown";
	}
}

/** Refreshes the Supabase Auth session for admin pages and admin API routes. */
async function refreshAdminSession(request: NextRequest) {
	let response = NextResponse.next({ request });

	const supabase = createServerClient(
		SUPABASE_URL,
		SUPABASE_PUBLISHABLE_KEY,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					for (const { name, value } of cookiesToSet) {
						request.cookies.set(name, value);
					}
					response = NextResponse.next({ request });
					for (const { name, value, options } of cookiesToSet) {
						response.cookies.set(name, value, options);
					}
				},
			},
		},
	);

	await supabase.auth.getUser();

	return response;
}

export async function proxy(request: NextRequest) {
	if (!isSupabaseConfigured()) {
		return NextResponse.next();
	}

	const match = ARTICLE_PATH.exec(request.nextUrl.pathname);
	if (match) {
		const exists = await publishedSlugExists(match[1]);
		if (exists === "missing") {
			return NextResponse.rewrite(new URL(NOT_FOUND_PATH, request.url), {
				status: 404,
			});
		}
		return NextResponse.next();
	}

	if (ADMIN_PATH.test(request.nextUrl.pathname)) {
		return refreshAdminSession(request);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*", "/api/admin/:path*", "/writings/:path*"],
};

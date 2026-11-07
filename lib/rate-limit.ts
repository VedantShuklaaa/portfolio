import { jsonError } from "@/lib/api/http";
import type { AdminContext } from "@/lib/auth/admin";

/**
 * Durable rate limiting through Postgres. In-memory counters are useless on
 * serverless, so the migration installs public.consume_rate_limit(), which
 * atomically increments a per-key window.
 */
export async function enforceRateLimit(
	context: AdminContext,
	key: string,
	limit: number,
	windowSeconds: number,
): Promise<Response | null> {
	const { data, error } = await context.supabase.rpc("consume_rate_limit", {
		p_key: `${key}:${context.user.id}`,
		p_limit: limit,
		p_window_seconds: windowSeconds,
	});

	if (error || !Array.isArray(data) || data.length === 0) {
		console.error("[rate-limit] unavailable", error);
		return jsonError(
			"service_unavailable",
			"Request protection is unavailable. Try again shortly.",
		);
	}

	const result = data[0];
	if (!result.allowed) {
		return jsonError("rate_limited", "Too many requests. Try again shortly.", {
			"Retry-After": String(Math.max(1, result.retry_after_seconds)),
		});
	}

	return null;
}

import type { NextRequest } from "next/server";

import { SITE_URL } from "@/lib/site";

export type ApiErrorCode =
	| "unauthorized"
	| "forbidden"
	| "invalid_request"
	| "not_found"
	| "conflict"
	| "payload_too_large"
	| "unsupported_media_type"
	| "rate_limited"
	| "service_unavailable"
	| "internal_error";

const STATUS_FOR_CODE: Record<ApiErrorCode, number> = {
	unauthorized: 401,
	forbidden: 403,
	invalid_request: 400,
	not_found: 404,
	conflict: 409,
	payload_too_large: 413,
	unsupported_media_type: 415,
	rate_limited: 429,
	service_unavailable: 503,
	internal_error: 500,
};

export function jsonError(
	code: ApiErrorCode,
	message: string,
	extraHeaders?: HeadersInit,
): Response {
	return Response.json(
		{ error: { code, message } },
		{
			status: STATUS_FOR_CODE[code],
			headers: {
				"Cache-Control": "no-store",
				...(extraHeaders ?? {}),
			},
		},
	);
}

/**
 * Reject state-changing requests that did not come from this site. Browsers
 * always send Origin on cross-origin POST/PATCH/DELETE and on same-origin
 * fetch; a missing Origin is treated as untrusted.
 */
export function assertSameOrigin(request: NextRequest): Response | null {
	const origin = request.headers.get("origin");
	if (!origin) {
		return jsonError("forbidden", "Origin header required");
	}

	const allowed = new Set<string>();
	try {
		allowed.add(new URL(SITE_URL).origin);
	} catch {
		// SITE_URL is validated elsewhere; request origin still applies.
	}
	allowed.add(request.nextUrl.origin);

	if (!allowed.has(origin)) {
		return jsonError("forbidden", "Origin not allowed");
	}

	return null;
}

export type JsonBodyResult =
	| { ok: true; value: unknown }
	| { ok: false; response: Response };

/** Read a JSON body with a hard byte ceiling. */
export async function readJsonBody(
	request: NextRequest,
	maxBytes: number,
): Promise<JsonBodyResult> {
	const declared = Number(request.headers.get("content-length") ?? 0);
	if (Number.isFinite(declared) && declared > maxBytes) {
		return {
			ok: false,
			response: jsonError("payload_too_large", "Request body is too large"),
		};
	}

	let text: string;
	try {
		text = await request.text();
	} catch {
		return {
			ok: false,
			response: jsonError("invalid_request", "Unreadable request body"),
		};
	}

	if (Buffer.byteLength(text, "utf8") > maxBytes) {
		return {
			ok: false,
			response: jsonError("payload_too_large", "Request body is too large"),
		};
	}

	try {
		return { ok: true, value: JSON.parse(text) as unknown };
	} catch {
		return {
			ok: false,
			response: jsonError("invalid_request", "Request body must be valid JSON"),
		};
	}
}

export function methodNotAllowed(allowed: string[]): Response {
	return Response.json(
		{ error: { code: "method_not_allowed", message: "Method not allowed" } },
		{
			status: 405,
			headers: {
				Allow: allowed.join(", "),
				"Cache-Control": "no-store",
			},
		},
	);
}

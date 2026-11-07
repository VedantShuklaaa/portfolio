import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";

import {
	assertSameOrigin,
	jsonError,
	methodNotAllowed,
	readJsonBody,
} from "@/lib/api/http";
import {
	ArticleConflictError,
	createArticle,
} from "@/lib/articles/repository";
import {
	ArticleInputSchema,
	MAX_ARTICLE_BYTES,
} from "@/lib/articles/schema";
import { getAdminContext } from "@/lib/auth/admin";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
	const originError = assertSameOrigin(request);
	if (originError) return originError;

	const context = await getAdminContext();
	if (!context) return jsonError("unauthorized", "Unauthorized");

	const limited = await enforceRateLimit(
		context,
		"articles:create",
		30,
		60,
	);
	if (limited) return limited;

	const body = await readJsonBody(request, MAX_ARTICLE_BYTES);
	if (!body.ok) return body.response;

	const parsed = ArticleInputSchema.safeParse(body.value);
	if (!parsed.success) {
		return jsonError("invalid_request", "Invalid article data");
	}

	try {
		const article = await createArticle(context.supabase, parsed.data);
		revalidatePath("/writings");
		revalidatePath(`/writings/${article.slug}`);

		return Response.json(
			{ article },
			{ status: 201, headers: { "Cache-Control": "no-store" } },
		);
	} catch (error) {
		if (error instanceof ArticleConflictError) {
			return jsonError("conflict", error.message);
		}
		console.error("[admin/articles] create failed", error);
		return jsonError("internal_error", "Could not create the article");
	}
}

export function GET() {
	return methodNotAllowed(["POST"]);
}

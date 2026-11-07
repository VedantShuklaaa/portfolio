import { revalidatePath, revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";

import {
	assertSameOrigin,
	jsonError,
	methodNotAllowed,
	readJsonBody,
} from "@/lib/api/http";
import {
	ArticleConflictError,
	deleteArticle,
	getArticleForAdmin,
	updateArticle,
} from "@/lib/articles/repository";
import {
	ArticlePatchSchema,
	MAX_ARTICLE_BYTES,
} from "@/lib/articles/schema";
import { getAdminContext } from "@/lib/auth/admin";
import { enforceRateLimit } from "@/lib/rate-limit";

const UUID_PATTERN =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type RouteParams = {
	params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, { params }: RouteParams) {
	const originError = assertSameOrigin(request);
	if (originError) return originError;

	const context = await getAdminContext();
	if (!context) return jsonError("unauthorized", "Unauthorized");

	const { id } = await params;
	if (!UUID_PATTERN.test(id)) {
		return jsonError("not_found", "Article not found");
	}

	const limited = await enforceRateLimit(
		context,
		"articles:update",
		60,
		60,
	);
	if (limited) return limited;

	const body = await readJsonBody(request, MAX_ARTICLE_BYTES);
	if (!body.ok) return body.response;

	const parsed = ArticlePatchSchema.safeParse(body.value);
	if (!parsed.success) {
		return jsonError("invalid_request", "Invalid article data");
	}

	try {
		const existing = await getArticleForAdmin(context.supabase, id);
		if (!existing) return jsonError("not_found", "Article not found");

		const article = await updateArticle(
			context.supabase,
			existing,
			parsed.data,
		);
		revalidatePath("/writings");
		revalidatePath(`/writings/${existing.slug}`);
		if (article.slug !== existing.slug) {
			revalidatePath(`/writings/${article.slug}`);
		}

		revalidateTag("articles", { expire: 0 });
		revalidateTag(`article:${existing.slug}`, { expire: 0 });
		if (article.slug !== existing.slug) {
			revalidateTag(`article:${article.slug}`, { expire: 0 });
		}

		return Response.json(
			{ article },
			{ headers: { "Cache-Control": "no-store" } },
		);
	} catch (error) {
		if (error instanceof ArticleConflictError) {
			return jsonError("conflict", error.message);
		}
		console.error("[admin/articles] update failed", error);
		return jsonError("internal_error", "Could not update the article");
	}
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
	const originError = assertSameOrigin(request);
	if (originError) return originError;

	const context = await getAdminContext();
	if (!context) return jsonError("unauthorized", "Unauthorized");

	const { id } = await params;
	if (!UUID_PATTERN.test(id)) {
		return jsonError("not_found", "Article not found");
	}

	const limited = await enforceRateLimit(
		context,
		"articles:delete",
		30,
		60,
	);
	if (limited) return limited;

	try {
		const existing = await getArticleForAdmin(context.supabase, id);
		if (!existing) return jsonError("not_found", "Article not found");

		await deleteArticle(context.supabase, id);
		revalidatePath("/writings");
		revalidatePath(`/writings/${existing.slug}`);
		revalidateTag("articles", { expire: 0 });
		revalidateTag(`article:${existing.slug}`, { expire: 0 });

		return new Response(null, {
			status: 204,
			headers: { "Cache-Control": "no-store" },
		});
	} catch (error) {
		console.error("[admin/articles] delete failed", error);
		return jsonError("internal_error", "Could not delete the article");
	}
}

export function GET() {
	return methodNotAllowed(["PATCH", "DELETE"]);
}

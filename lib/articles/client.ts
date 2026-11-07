import type { ArticleBlock, ArticleInput } from "@/lib/articles/schema";

export function normalizeBlock(block: ArticleBlock): ArticleBlock {
	if (block.type !== "list") return block;
	return {
		...block,
		items: block.items.map((item) => item.trim()).filter(Boolean),
	};
}

export function parseTags(value: string): string[] {
	return Array.from(
		new Set(
			value
				.split(",")
				.map((tag) => tag.trim())
				.filter(Boolean),
		),
	).slice(0, 10);
}

function readApiError(value: unknown): string | null {
	if (!value || typeof value !== "object") return null;
	const error = (value as Record<string, unknown>).error;
	if (!error || typeof error !== "object") return null;
	const message = (error as Record<string, unknown>).message;
	return typeof message === "string" ? message : null;
}

function readArticleId(value: unknown): string | null {
	if (!value || typeof value !== "object") return null;
	const article = (value as Record<string, unknown>).article;
	if (!article || typeof article !== "object") return null;
	const id = (article as Record<string, unknown>).id;
	return typeof id === "string" ? id : null;
}

export type SaveResult =
	| { ok: true; id: string | null }
	| { ok: false; message: string };

/** Saves through the protected admin API. Errors are already user-safe. */
export async function saveArticle(
	input: ArticleInput,
	id?: string,
): Promise<SaveResult> {
	const response = await fetch(
		id ? `/api/admin/articles/${id}` : "/api/admin/articles",
		{
			method: id ? "PATCH" : "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(input),
		},
	);

	if (!response.ok) {
		const body: unknown = await response.json().catch(() => null);
		return {
			ok: false,
			message: readApiError(body) ?? "Could not save the article.",
		};
	}

	const body: unknown = await response.json().catch(() => null);
	return { ok: true, id: readArticleId(body) };
}

/** Deletes through the protected admin API. */
export async function deleteArticleRequest(
	id: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
	const response = await fetch(`/api/admin/articles/${id}`, {
		method: "DELETE",
	});

	if (!response.ok) {
		const body: unknown = await response.json().catch(() => null);
		return {
			ok: false,
			message: readApiError(body) ?? "Could not delete the article.",
		};
	}

	return { ok: true };
}

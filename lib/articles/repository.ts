import type { SupabaseClient } from "@supabase/supabase-js";

import {
	parseArticleContent,
	SlugSchema,
	ThumbnailSchema,
	type ArticleInput,
	type ArticlePatch,
	type Thumbnail,
} from "@/lib/articles/schema";
import type {
	ArticleRow,
	ArticleStatus,
	Database,
} from "@/lib/supabase/database.types";
import {
	isSupabaseConfigured,
} from "@/lib/supabase/env";
import { createSupabasePublicClient } from "@/lib/supabase/public";

type Client = SupabaseClient<Database>;

export type ArticleSummary = {
	id: string;
	slug: string;
	title: string;
	description: string | null;
	thumbnail: Thumbnail | null;
	tags: string[];
	status: ArticleStatus;
	publishedAt: string | null;
	updatedAt: string;
};

export type FullArticle = ArticleSummary & {
	content: unknown;
};

export class ArticleConflictError extends Error {
	constructor() {
		super("An article with this slug already exists");
		this.name = "ArticleConflictError";
	}
}

const SUMMARY_COLUMNS =
	"id, slug, title, description, thumbnail, tags, status, published_at, updated_at";

function parseThumbnail(value: unknown) {
	const parsed = ThumbnailSchema.safeParse(value);
	return parsed.success ? parsed.data : null;
}

function toSummary(row: ArticleRow): ArticleSummary {
	return {
		id: row.id,
		slug: row.slug,
		title: row.title,
		description: row.description,
		thumbnail: parseThumbnail(row.thumbnail),
		tags: Array.isArray(row.tags) ? row.tags : [],
		status: row.status,
		publishedAt: row.published_at,
		updatedAt: row.updated_at,
	};
}

function fail(context: string, error: unknown): never {
	// Log the server-side detail, never send it to the client.
	console.error(`[articles] ${context}`, error);
	throw new Error("Articles are temporarily unavailable");
}

/** Published articles, newest publication first. RLS also filters drafts. */
export async function listPublishedArticles(): Promise<ArticleSummary[]> {
	// Lets `next build` (which runs before deployment env is present) render the
	// empty state instead of failing. Configured deployments always hit the DB.
	if (!isSupabaseConfigured()) return [];

	const supabase = createSupabasePublicClient();
	const { data, error } = await supabase
		.from("articles")
		.select(SUMMARY_COLUMNS)
		.eq("status", "published")
		.order("published_at", { ascending: false, nullsFirst: false });

	if (error) fail("list published", error);
	return (data ?? []).map((row) => toSummary(row as ArticleRow));
}

/** One published article by slug. Invalid slugs and drafts return null. */
export async function getPublishedArticleBySlug(
	slug: string,
): Promise<FullArticle | null> {
	if (!SlugSchema.safeParse(slug).success) return null;
	if (!isSupabaseConfigured()) return null;

	const supabase = createSupabasePublicClient();
	const { data, error } = await supabase
		.from("articles")
		.select("*")
		.eq("slug", slug)
		.eq("status", "published")
		.maybeSingle();

	if (error) fail("get published by slug", error);
	if (!data) return null;

	const row = data as ArticleRow;
	return { ...toSummary(row), content: row.content };
}

/** Admin-only reads. The caller must pass a session-bound client. */
export async function listArticlesForAdmin(
	supabase: Client,
): Promise<ArticleSummary[]> {
	const { data, error } = await supabase
		.from("articles")
		.select(SUMMARY_COLUMNS)
		.order("updated_at", { ascending: false });

	if (error) fail("list for admin", error);
	return (data ?? []).map((row) => toSummary(row as ArticleRow));
}

export async function getArticleForAdmin(
	supabase: Client,
	id: string,
): Promise<FullArticle | null> {
	const { data, error } = await supabase
		.from("articles")
		.select("*")
		.eq("id", id)
		.maybeSingle();

	if (error) fail("get for admin", error);
	if (!data) return null;

	const row = data as ArticleRow;
	return { ...toSummary(row), content: row.content };
}

export async function createArticle(
	supabase: Client,
	input: ArticleInput,
): Promise<FullArticle> {
	const now = new Date().toISOString();
	const status = input.status ?? "draft";

	const { data, error } = await supabase
		.from("articles")
		.insert({
			title: input.title,
			slug: input.slug,
			description: input.description?.trim() || null,
			thumbnail: input.thumbnail ?? null,
			content: input.content,
			tags: input.tags ?? [],
			status,
			published_at: status === "published" ? now : null,
		})
		.select("*")
		.single();

	if (error) {
		if (error.code === "23505") throw new ArticleConflictError();
		fail("create", error);
	}

	const row = data as ArticleRow;
	return { ...toSummary(row), content: row.content };
}

export async function updateArticle(
	supabase: Client,
	existing: FullArticle,
	patch: ArticlePatch,
): Promise<FullArticle> {
	const update: {
		title?: string;
		slug?: string;
		description?: string | null;
		thumbnail?: unknown;
		content?: unknown;
		tags?: string[];
		status?: ArticleStatus;
		published_at?: string | null;
	} = {};

	// Explicit allowlist: ids, timestamps and unknown keys are never written.
	if (patch.title !== undefined) update.title = patch.title;
	if (patch.slug !== undefined) update.slug = patch.slug;
	if (patch.description !== undefined) {
		update.description = patch.description?.trim() || null;
	}
	if (patch.thumbnail !== undefined) update.thumbnail = patch.thumbnail;
	if (patch.content !== undefined) update.content = patch.content;
	if (patch.tags !== undefined) update.tags = patch.tags;
	if (patch.status !== undefined) {
		update.status = patch.status;
		if (patch.status === "published") {
			update.published_at =
				existing.status === "published" && existing.publishedAt
					? existing.publishedAt
					: new Date().toISOString();
		} else {
			update.published_at = null;
		}
	}

	const { data, error } = await supabase
		.from("articles")
		.update(update)
		.eq("id", existing.id)
		.select("*")
		.single();

	if (error) {
		if (error.code === "23505") throw new ArticleConflictError();
		fail("update", error);
	}

	const row = data as ArticleRow;
	return { ...toSummary(row), content: row.content };
}

export async function deleteArticle(supabase: Client, id: string) {
	const { error } = await supabase.from("articles").delete().eq("id", id);
	if (error) fail("delete", error);
}

/** Safe read-side content parsing for the renderer. */
export { parseArticleContent };

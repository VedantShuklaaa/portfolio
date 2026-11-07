import { z } from "zod";

import { isAllowedMediaUrl } from "@/lib/supabase/env";

export const MAX_BLOCKS = 200;
export const MAX_ARTICLE_BYTES = 256 * 1024;

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const mediaUrlSchema = z
	.string()
	.trim()
	.max(2048)
	.refine(isAllowedMediaUrl, {
		message: "Media must be a local asset or an uploaded article file",
	});

const rasterUrlSchema = mediaUrlSchema.refine(
	(value) => !isSvgUrl(value),
	"Use the SVG block for SVG files",
);

export function isSvgUrl(value: string): boolean {
	return /\.svg(?:$|[?#])/i.test(value);
}

const altSchema = z.string().trim().max(300).optional();
const captionSchema = z.string().trim().max(500).optional();
const dimensionSchema = z.number().int().positive().max(10000).optional();

export const ThumbnailSchema = z.object({
	url: rasterUrlSchema,
	alt: altSchema,
	width: dimensionSchema,
	height: dimensionSchema,
});

export type Thumbnail = z.infer<typeof ThumbnailSchema>;

const ImageMediaSchema = z.object({
	type: z.literal("image"),
	url: rasterUrlSchema,
	alt: altSchema,
	width: dimensionSchema,
	height: dimensionSchema,
});

const VideoMediaSchema = z.object({
	type: z.literal("video"),
	url: mediaUrlSchema,
	poster: mediaUrlSchema.optional(),
});

const SvgMediaSchema = z.object({
	type: z.literal("svg"),
	url: mediaUrlSchema,
	alt: altSchema,
	width: dimensionSchema,
	height: dimensionSchema,
});

export const MediaSchema = z.discriminatedUnion("type", [
	ImageMediaSchema,
	VideoMediaSchema,
	SvgMediaSchema,
]);

export type ArticleMedia = z.infer<typeof MediaSchema>;

const CoverBlockSchema = z.object({
	type: z.literal("cover"),
	media: MediaSchema,
	caption: captionSchema,
});

const HeadingBlockSchema = z.object({
	type: z.literal("heading"),
	level: z.union([z.literal(2), z.literal(3), z.literal(4)]),
	text: z.string().trim().min(1).max(300),
});

const ParagraphBlockSchema = z.object({
	type: z.literal("paragraph"),
	text: z.string().trim().min(1).max(20000),
});

const ImageBlockSchema = z.object({
	type: z.literal("image"),
	url: rasterUrlSchema,
	alt: altSchema,
	width: dimensionSchema,
	height: dimensionSchema,
	caption: captionSchema,
});

const VideoBlockSchema = z.object({
	type: z.literal("video"),
	url: mediaUrlSchema,
	poster: mediaUrlSchema.optional(),
	caption: captionSchema,
});

const SvgBlockSchema = z.object({
	type: z.literal("svg"),
	url: mediaUrlSchema,
	alt: altSchema,
	width: dimensionSchema,
	height: dimensionSchema,
	caption: captionSchema,
});

const CodeBlockSchema = z.object({
	type: z.literal("code"),
	code: z.string().min(1).max(50000),
	language: z
		.string()
		.trim()
		.max(30)
		.regex(/^[A-Za-z0-9+#._-]*$/, "Invalid language")
		.optional(),
	filename: z.string().trim().max(200).optional(),
});

const QuoteBlockSchema = z.object({
	type: z.literal("quote"),
	text: z.string().trim().min(1).max(5000),
	cite: z.string().trim().max(300).optional(),
});

const ListBlockSchema = z.object({
	type: z.literal("list"),
	ordered: z.boolean().optional(),
	items: z
		.array(z.string().trim().min(1).max(1000))
		.min(1)
		.max(50),
});

const CalloutBlockSchema = z.object({
	type: z.literal("callout"),
	title: z.string().trim().max(200).optional(),
	text: z.string().trim().min(1).max(5000),
});

const youtubeIdPattern = /^[A-Za-z0-9_-]{11}$/;
const vimeoIdPattern = /^\d{5,12}$/;

export function getYouTubeId(value: string): string | null {
	let url: URL;
	try {
		url = new URL(value);
	} catch {
		return null;
	}
	if (url.protocol !== "https:") return null;

	const host = url.hostname.replace(/^www\./, "");
	if (host === "youtu.be") {
		const id = url.pathname.split("/").filter(Boolean)[0];
		return id && youtubeIdPattern.test(id) ? id : null;
	}
	if (host !== "youtube.com" && host !== "m.youtube.com") return null;

	if (url.pathname === "/watch") {
		const id = url.searchParams.get("v");
		return id && youtubeIdPattern.test(id) ? id : null;
	}

	const match = url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)$/);
	return match && youtubeIdPattern.test(match[1]) ? match[1] : null;
}

export function getVimeoId(value: string): string | null {
	let url: URL;
	try {
		url = new URL(value);
	} catch {
		return null;
	}
	if (url.protocol !== "https:") return null;

	const host = url.hostname.replace(/^www\./, "");
	if (host !== "vimeo.com" && host !== "player.vimeo.com") return null;

	const match = url.pathname.match(/^\/(?:video\/)?([^/]+)\/?$/);
	return match && vimeoIdPattern.test(match[1]) ? match[1] : null;
}

const YouTubeEmbedSchema = z.object({
	type: z.literal("embed"),
	provider: z.literal("youtube"),
	url: z
		.string()
		.trim()
		.max(500)
		.refine((value) => getYouTubeId(value) !== null, "Invalid YouTube URL"),
	title: z.string().trim().max(200).optional(),
});

const VimeoEmbedSchema = z.object({
	type: z.literal("embed"),
	provider: z.literal("vimeo"),
	url: z
		.string()
		.trim()
		.max(500)
		.refine((value) => getVimeoId(value) !== null, "Invalid Vimeo URL"),
	title: z.string().trim().max(200).optional(),
});

const DividerBlockSchema = z.object({ type: z.literal("divider") });

export const ArticleBlockSchema = z.union([
	CoverBlockSchema,
	HeadingBlockSchema,
	ParagraphBlockSchema,
	ImageBlockSchema,
	VideoBlockSchema,
	SvgBlockSchema,
	CodeBlockSchema,
	QuoteBlockSchema,
	ListBlockSchema,
	CalloutBlockSchema,
	YouTubeEmbedSchema,
	VimeoEmbedSchema,
	DividerBlockSchema,
]);

export type ArticleBlock = z.infer<typeof ArticleBlockSchema>;

export const ArticleContentSchema = z.object({
	schemaVersion: z.literal(1),
	blocks: z.array(ArticleBlockSchema).max(MAX_BLOCKS),
});

export type ArticleContent = z.infer<typeof ArticleContentSchema>;

export const ArticleStatusSchema = z.enum(["draft", "published"]);

export const SlugSchema = z
	.string()
	.trim()
	.min(1)
	.max(80)
	.regex(slugPattern, "Use lowercase letters, numbers and single hyphens");

const tagSchema = z
	.string()
	.trim()
	.min(1)
	.max(40)
	.refine((value) => !/[\u0000-\u001f\u007f]/.test(value), "Invalid tag");

export const ArticleInputSchema = z.object({
	title: z.string().trim().min(1).max(200),
	slug: SlugSchema,
	description: z.string().trim().max(500).nullable().optional(),
	thumbnail: ThumbnailSchema.nullable().optional(),
	content: ArticleContentSchema,
	tags: z.array(tagSchema).max(10).optional(),
	status: ArticleStatusSchema.optional(),
});

export type ArticleInput = z.infer<typeof ArticleInputSchema>;

export const ArticlePatchSchema = ArticleInputSchema.partial().refine(
	(value) => Object.keys(value).length > 0,
	{ message: "No fields to update" },
);

export type ArticlePatch = z.infer<typeof ArticlePatchSchema>;

export type ParsedArticleContent = {
	blocks: ArticleBlock[];
	invalidBlocks: number;
};

/**
 * Tolerant read-side parser: one malformed or unknown block never breaks the
 * whole article. Write-side validation always uses ArticleContentSchema.
 */
export function parseArticleContent(raw: unknown): ParsedArticleContent {
	if (!raw || typeof raw !== "object") {
		return { blocks: [], invalidBlocks: 1 };
	}

	const record = raw as Record<string, unknown>;
	if (record.schemaVersion !== 1 || !Array.isArray(record.blocks)) {
		return { blocks: [], invalidBlocks: 1 };
	}

	const blocks: ArticleBlock[] = [];
	let invalidBlocks = 0;

	for (const candidate of record.blocks.slice(0, MAX_BLOCKS)) {
		const parsed = ArticleBlockSchema.safeParse(candidate);
		if (parsed.success) {
			blocks.push(parsed.data);
		} else {
			invalidBlocks += 1;
		}
	}

	if (record.blocks.length > MAX_BLOCKS) {
		invalidBlocks += record.blocks.length - MAX_BLOCKS;
	}

	return { blocks, invalidBlocks };
}

/** Server-built embed URL. Never uses the raw user URL as the frame source. */
export function getEmbedSrc(block: Extract<ArticleBlock, { type: "embed" }>): string | null {
	if (block.provider === "youtube") {
		const id = getYouTubeId(block.url);
		return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
	}

	const id = getVimeoId(block.url);
	return id ? `https://player.vimeo.com/video/${id}` : null;
}

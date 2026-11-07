import type { ArticleBlock } from "@/lib/articles/schema";

export const BLOCK_TYPES = [
	"paragraph",
	"heading",
	"image",
	"video",
	"svg",
	"code",
	"quote",
	"list",
	"callout",
	"embed",
	"cover",
	"divider",
] as const;

export type BlockType = (typeof BLOCK_TYPES)[number];

export const BLOCK_LABELS: Record<BlockType, string> = {
	paragraph: "Paragraph",
	heading: "Heading",
	image: "Image",
	video: "Video",
	svg: "SVG",
	code: "Code",
	quote: "Quote",
	list: "List",
	callout: "Callout",
	embed: "Embed",
	cover: "Cover",
	divider: "Divider",
};

/** Editor-only defaults. URLs are filled in before the article is saved. */
export function createEmptyBlock(type: BlockType): ArticleBlock {
	switch (type) {
		case "paragraph":
			return { type, text: "" };
		case "heading":
			return { type, level: 2, text: "" };
		case "image":
			return { type, url: "" };
		case "video":
			return { type, url: "" };
		case "svg":
			return { type, url: "" };
		case "code":
			return { type, code: "" };
		case "quote":
			return { type, text: "" };
		case "list":
			return { type, ordered: false, items: [""] };
		case "callout":
			return { type, text: "" };
		case "embed":
			return { type, provider: "youtube", url: "" };
		case "cover":
			return { type, media: { type: "image", url: "" } };
		case "divider":
			return { type };
	}
}

import { CalloutBlockView } from "@/components/articles/blocks/callout-block";
import { CodeBlockView } from "@/components/articles/blocks/code-block";
import { CoverBlockView } from "@/components/articles/blocks/cover-block";
import { DividerBlockView } from "@/components/articles/blocks/divider-block";
import { EmbedBlockView } from "@/components/articles/blocks/embed-block";
import { HeadingBlockView } from "@/components/articles/blocks/heading-block";
import { ImageBlockView } from "@/components/articles/blocks/image-block";
import { ListBlockView } from "@/components/articles/blocks/list-block";
import { ParagraphBlockView } from "@/components/articles/blocks/paragraph-block";
import { QuoteBlockView } from "@/components/articles/blocks/quote-block";
import { SvgBlockView } from "@/components/articles/blocks/svg-block";
import { VideoBlockView } from "@/components/articles/blocks/video-block";
import type { ArticleBlock } from "@/lib/articles/schema";

export function ArticleBlockView({ block }: { block: ArticleBlock }) {
	switch (block.type) {
		case "cover":
			return <CoverBlockView block={block} />;
		case "heading":
			return <HeadingBlockView block={block} />;
		case "paragraph":
			return <ParagraphBlockView block={block} />;
		case "image":
			return <ImageBlockView block={block} />;
		case "video":
			return <VideoBlockView block={block} />;
		case "svg":
			return <SvgBlockView block={block} />;
		case "code":
			return <CodeBlockView block={block} />;
		case "quote":
			return <QuoteBlockView block={block} />;
		case "list":
			return <ListBlockView block={block} />;
		case "callout":
			return <CalloutBlockView block={block} />;
		case "embed":
			return <EmbedBlockView block={block} />;
		case "divider":
			return <DividerBlockView />;
	}
}

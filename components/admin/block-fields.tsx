"use client";

import { CalloutFields } from "@/components/admin/block-fields/callout-fields";
import { CodeFields } from "@/components/admin/block-fields/code-fields";
import { CoverFields } from "@/components/admin/block-fields/cover-fields";
import { DividerFields } from "@/components/admin/block-fields/divider-fields";
import { EmbedFields } from "@/components/admin/block-fields/embed-fields";
import { HeadingFields } from "@/components/admin/block-fields/heading-fields";
import { ImageFields } from "@/components/admin/block-fields/image-fields";
import { ListFields } from "@/components/admin/block-fields/list-fields";
import { ParagraphFields } from "@/components/admin/block-fields/paragraph-fields";
import { QuoteFields } from "@/components/admin/block-fields/quote-fields";
import { SvgFields } from "@/components/admin/block-fields/svg-fields";
import { VideoFields } from "@/components/admin/block-fields/video-fields";
import type { ArticleBlock } from "@/lib/articles/schema";

export function BlockFields({
	block,
	onChange,
}: {
	block: ArticleBlock;
	onChange: (block: ArticleBlock) => void;
}) {
	switch (block.type) {
		case "heading":
			return <HeadingFields block={block} onChange={onChange} />;
		case "paragraph":
			return <ParagraphFields block={block} onChange={onChange} />;
		case "image":
			return <ImageFields block={block} onChange={onChange} />;
		case "video":
			return <VideoFields block={block} onChange={onChange} />;
		case "svg":
			return <SvgFields block={block} onChange={onChange} />;
		case "code":
			return <CodeFields block={block} onChange={onChange} />;
		case "quote":
			return <QuoteFields block={block} onChange={onChange} />;
		case "list":
			return <ListFields block={block} onChange={onChange} />;
		case "callout":
			return <CalloutFields block={block} onChange={onChange} />;
		case "embed":
			return <EmbedFields block={block} onChange={onChange} />;
		case "cover":
			return <CoverFields block={block} onChange={onChange} />;
		case "divider":
			return <DividerFields />;
	}
}

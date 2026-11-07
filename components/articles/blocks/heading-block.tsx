import { cn } from "@/lib/utils";
import type { ArticleBlock } from "@/lib/articles/schema";

type HeadingBlock = Extract<ArticleBlock, { type: "heading" }>;

const LEVEL_CLASSES: Record<HeadingBlock["level"], string> = {
	2: "text-xl sm:text-2xl",
	3: "text-lg sm:text-xl",
	4: "text-base sm:text-lg",
};

const LEVEL_TAGS = { 2: "h2", 3: "h3", 4: "h4" } as const;

export function HeadingBlockView({ block }: { block: HeadingBlock }) {
	const Tag = LEVEL_TAGS[block.level];

	return (
		<Tag
			className={cn(
				"scroll-mt-24 text-balance",
				block.level > 2 && "mt-2",
				LEVEL_CLASSES[block.level],
			)}
		>
			{block.text}
		</Tag>
	);
}

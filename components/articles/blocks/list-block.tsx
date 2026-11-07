import type { ArticleBlock } from "@/lib/articles/schema";

type ListBlock = Extract<ArticleBlock, { type: "list" }>;

export function ListBlockView({ block }: { block: ListBlock }) {
	const Tag = block.ordered ? "ol" : "ul";

	return (
		<Tag
			className={
				block.ordered
					? "list-decimal space-y-1.5 pl-5 text-[15px] leading-relaxed"
					: "list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed"
			}
		>
			{block.items.map((item, index) => (
				<li key={index}>{item}</li>
			))}
		</Tag>
	);
}

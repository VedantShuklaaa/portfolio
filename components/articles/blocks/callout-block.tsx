import type { ArticleBlock } from "@/lib/articles/schema";

type CalloutBlock = Extract<ArticleBlock, { type: "callout" }>;

export function CalloutBlockView({ block }: { block: CalloutBlock }) {
	return (
		<aside className="rounded-lg border border-border bg-muted p-4">
			{block.title ? (
				<p className="font-heading text-sm font-medium">{block.title}</p>
			) : null}
			<p className="whitespace-pre-line text-[15px] leading-relaxed">
				{block.text}
			</p>
		</aside>
	);
}

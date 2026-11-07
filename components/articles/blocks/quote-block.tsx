import type { ArticleBlock } from "@/lib/articles/schema";

type QuoteBlock = Extract<ArticleBlock, { type: "quote" }>;

export function QuoteBlockView({ block }: { block: QuoteBlock }) {
	return (
		<blockquote className="border-l-2 border-border pl-4">
			<p className="text-[15px] leading-relaxed text-muted-foreground">
				{block.text}
			</p>
			{block.cite ? (
				<cite className="mt-2 block font-mono text-xs not-italic text-muted-foreground">
					— {block.cite}
				</cite>
			) : null}
		</blockquote>
	);
}

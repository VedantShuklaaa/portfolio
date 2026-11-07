import type { ArticleBlock } from "@/lib/articles/schema";

type CodeBlock = Extract<ArticleBlock, { type: "code" }>;

export function CodeBlockView({ block }: { block: CodeBlock }) {
	const showHeader = Boolean(block.filename || block.language);

	return (
		<div className="overflow-hidden rounded-lg border border-border">
			{showHeader ? (
				<div className="flex items-center justify-between gap-3 border-b border-border bg-muted px-4 py-2 font-mono text-xs text-muted-foreground">
					<span className="truncate">{block.filename ?? ""}</span>
					<span>{block.language ?? ""}</span>
				</div>
			) : null}
			<pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed">
				<code>{block.code}</code>
			</pre>
		</div>
	);
}

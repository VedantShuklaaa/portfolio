import { ArticleBlockView } from "@/components/articles/article-block";
import { parseArticleContent } from "@/lib/articles/schema";

/**
 * Validates each block on read and renders them in stored order. A malformed
 * or unknown block is skipped without taking down the rest of the article.
 */
export function ArticleRenderer({ content }: { content: unknown }) {
	const { blocks, invalidBlocks } = parseArticleContent(content);

	if (blocks.length === 0 && invalidBlocks === 0) return null;

	return (
		<div className="mt-10 flex flex-col gap-6">
			{blocks.map((block, index) => (
				<ArticleBlockView key={`${block.type}-${index}`} block={block} />
			))}
			{invalidBlocks > 0 ? (
				<p className="font-mono text-xs text-muted-foreground">
					Some content in this article could not be displayed.
				</p>
			) : null}
		</div>
	);
}

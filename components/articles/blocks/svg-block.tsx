import { BlockFigure } from "@/components/articles/block-figure";
import type { ArticleBlock } from "@/lib/articles/schema";

type SvgBlock = Extract<ArticleBlock, { type: "svg" }>;

/**
 * SVGs are rendered as images, never inlined. Browsers do not run scripts in
 * an SVG loaded through <img>, and uploads are additionally sanitized.
 */
export function SvgBlockView({ block }: { block: SvgBlock }) {
	return (
		<BlockFigure caption={block.caption}>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src={block.url}
				alt={block.alt ?? ""}
				width={block.width}
				height={block.height}
				loading="lazy"
				decoding="async"
				className="h-auto w-full"
			/>
		</BlockFigure>
	);
}

import { BlockFigure } from "@/components/articles/block-figure";
import type { ArticleBlock } from "@/lib/articles/schema";

type VideoBlock = Extract<ArticleBlock, { type: "video" }>;

export function VideoBlockView({ block }: { block: VideoBlock }) {
	return (
		<BlockFigure caption={block.caption}>
			<video
				controls
				preload="metadata"
				playsInline
				poster={block.poster}
				className="h-auto w-full"
			>
				<source src={block.url} />
				Your browser does not support embedded video.
			</video>
		</BlockFigure>
	);
}

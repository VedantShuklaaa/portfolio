import Image from "next/image";

import { BlockFigure } from "@/components/articles/block-figure";
import type { ArticleBlock } from "@/lib/articles/schema";

type ImageBlock = Extract<ArticleBlock, { type: "image" }>;

export function ImageBlockView({ block }: { block: ImageBlock }) {
	return (
		<BlockFigure caption={block.caption}>
			<Image
				src={block.url}
				alt={block.alt ?? ""}
				width={block.width ?? 1200}
				height={block.height ?? 800}
				sizes="(min-width: 640px) 600px, 100vw"
				className="h-auto w-full"
			/>
		</BlockFigure>
	);
}

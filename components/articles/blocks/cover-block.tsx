import Image from "next/image";

import { BlockFigure } from "@/components/articles/block-figure";
import type { ArticleBlock, ArticleMedia } from "@/lib/articles/schema";

function CoverMedia({ media }: { media: ArticleMedia }) {
	if (media.type === "image") {
		return (
			<Image
				src={media.url}
				alt={media.alt ?? ""}
				width={media.width ?? 1200}
				height={media.height ?? 800}
				sizes="(min-width: 640px) 600px, 100vw"
				className="h-auto w-full"
				priority
			/>
		);
	}

	if (media.type === "video") {
		return (
			<video controls preload="metadata" playsInline className="h-auto w-full">
				<source src={media.url} />
				Your browser does not support embedded video.
			</video>
		);
	}

	return (
		/* eslint-disable-next-line @next/next/no-img-element */
		<img
			src={media.url}
			alt={media.alt ?? ""}
			width={media.width}
			height={media.height}
			decoding="async"
			className="h-auto w-full"
		/>
	);
}

type CoverBlock = Extract<ArticleBlock, { type: "cover" }>;

export function CoverBlockView({ block }: { block: CoverBlock }) {
	return (
		<BlockFigure caption={block.caption}>
			<CoverMedia media={block.media} />
		</BlockFigure>
	);
}

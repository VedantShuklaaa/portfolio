import { getEmbedSrc, type ArticleBlock } from "@/lib/articles/schema";

type EmbedBlock = Extract<ArticleBlock, { type: "embed" }>;

const PROVIDER_TITLE: Record<EmbedBlock["provider"], string> = {
	youtube: "YouTube video",
	vimeo: "Vimeo video",
};

export function EmbedBlockView({ block }: { block: EmbedBlock }) {
	const src = getEmbedSrc(block);
	if (!src) return null;

	return (
		<div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-muted">
			<iframe
				src={src}
				title={block.title ?? PROVIDER_TITLE[block.provider]}
				loading="lazy"
				allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowFullScreen
				referrerPolicy="strict-origin-when-cross-origin"
				className="absolute inset-0 h-full w-full"
			/>
		</div>
	);
}

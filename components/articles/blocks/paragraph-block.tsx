import type { ArticleBlock } from "@/lib/articles/schema";

type ParagraphBlock = Extract<ArticleBlock, { type: "paragraph" }>;

export function ParagraphBlockView({ block }: { block: ParagraphBlock }) {
	const paragraphs = block.text.split(/\n{2,}/).filter(Boolean);

	return (
		<div className="flex flex-col gap-5">
			{paragraphs.map((paragraph, index) => (
				<p
					key={index}
					className="whitespace-pre-line text-[15px] leading-relaxed"
				>
					{paragraph}
				</p>
			))}
		</div>
	);
}

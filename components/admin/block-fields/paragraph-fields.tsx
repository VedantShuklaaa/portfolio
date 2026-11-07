"use client";

import { Field, inputClass } from "@/components/admin/field";
import type { ArticleBlock } from "@/lib/articles/schema";

export function ParagraphFields({
	block,
	onChange,
}: {
	block: Extract<ArticleBlock, { type: "paragraph" }>;
	onChange: (block: ArticleBlock) => void;
}) {
	return (
		<Field label="Text">
			<textarea
				value={block.text}
				onChange={(event) => onChange({ ...block, text: event.target.value })}
				aria-label="Paragraph text"
				className={`${inputClass} min-h-32`}
			/>
		</Field>
	);
}

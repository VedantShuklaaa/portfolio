"use client";

import { Field, inputClass } from "@/components/admin/field";
import type { ArticleBlock } from "@/lib/articles/schema";

export function QuoteFields({
	block,
	onChange,
}: {
	block: Extract<ArticleBlock, { type: "quote" }>;
	onChange: (block: ArticleBlock) => void;
}) {
	return (
		<div className="flex flex-col gap-3">
			<Field label="Quote">
				<textarea
					value={block.text}
					onChange={(event) => onChange({ ...block, text: event.target.value })}
					aria-label="Quote text"
					className={`${inputClass} min-h-24`}
				/>
			</Field>
			<Field label="Attribution">
				<input
					type="text"
					value={block.cite ?? ""}
					onChange={(event) => onChange({ ...block, cite: event.target.value })}
					aria-label="Quote attribution"
					className={inputClass}
				/>
			</Field>
		</div>
	);
}

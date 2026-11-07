"use client";

import { Field, inputClass } from "@/components/admin/field";
import type { ArticleBlock } from "@/lib/articles/schema";

export function CalloutFields({
	block,
	onChange,
}: {
	block: Extract<ArticleBlock, { type: "callout" }>;
	onChange: (block: ArticleBlock) => void;
}) {
	return (
		<div className="flex flex-col gap-3">
			<Field label="Title" hint="Optional">
				<input
					type="text"
					value={block.title ?? ""}
					onChange={(event) => onChange({ ...block, title: event.target.value })}
					aria-label="Callout title"
					className={inputClass}
				/>
			</Field>
			<Field label="Text">
				<textarea
					value={block.text}
					onChange={(event) => onChange({ ...block, text: event.target.value })}
					aria-label="Callout text"
					className={`${inputClass} min-h-24`}
				/>
			</Field>
		</div>
	);
}

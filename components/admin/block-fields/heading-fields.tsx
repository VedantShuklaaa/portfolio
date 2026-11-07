"use client";

import { Field, inputClass } from "@/components/admin/field";
import type { ArticleBlock } from "@/lib/articles/schema";

export function HeadingFields({
	block,
	onChange,
}: {
	block: Extract<ArticleBlock, { type: "heading" }>;
	onChange: (block: ArticleBlock) => void;
}) {
	return (
		<div className="grid gap-3 sm:grid-cols-[7rem_1fr]">
			<Field label="Level">
				<select
					value={block.level}
					onChange={(event) => {
						const level =
							event.target.value === "3"
								? 3
								: event.target.value === "4"
									? 4
									: 2;
						onChange({ ...block, level });
					}}
					aria-label="Heading level"
					className={inputClass}
				>
					<option value="2">H2</option>
					<option value="3">H3</option>
					<option value="4">H4</option>
				</select>
			</Field>
			<Field label="Text">
				<input
					type="text"
					value={block.text}
					onChange={(event) => onChange({ ...block, text: event.target.value })}
					aria-label="Heading text"
					className={inputClass}
				/>
			</Field>
		</div>
	);
}

"use client";

import { Field, inputClass } from "@/components/admin/field";
import type { ArticleBlock } from "@/lib/articles/schema";

export function CodeFields({
	block,
	onChange,
}: {
	block: Extract<ArticleBlock, { type: "code" }>;
	onChange: (block: ArticleBlock) => void;
}) {
	return (
		<div className="flex flex-col gap-3">
			<div className="grid gap-3 sm:grid-cols-2">
				<Field label="Language">
					<input
						type="text"
						value={block.language ?? ""}
						onChange={(event) =>
							onChange({ ...block, language: event.target.value })
						}
						aria-label="Code language"
						placeholder="rust"
						className={inputClass}
					/>
				</Field>
				<Field label="Filename">
					<input
						type="text"
						value={block.filename ?? ""}
						onChange={(event) =>
							onChange({ ...block, filename: event.target.value })
						}
						aria-label="Code filename"
						placeholder="main.rs"
						className={inputClass}
					/>
				</Field>
			</div>
			<Field label="Code">
				<textarea
					value={block.code}
					onChange={(event) => onChange({ ...block, code: event.target.value })}
					aria-label="Code"
					spellCheck={false}
					className={`${inputClass} min-h-40 font-mono text-xs`}
				/>
			</Field>
		</div>
	);
}

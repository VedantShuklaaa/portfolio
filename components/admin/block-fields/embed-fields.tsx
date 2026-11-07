"use client";

import { Field, inputClass } from "@/components/admin/field";
import type { ArticleBlock } from "@/lib/articles/schema";

export function EmbedFields({
	block,
	onChange,
}: {
	block: Extract<ArticleBlock, { type: "embed" }>;
	onChange: (block: ArticleBlock) => void;
}) {
	return (
		<div className="flex flex-col gap-3">
			<Field label="Provider">
				<select
					value={block.provider}
					onChange={(event) =>
						onChange({
							type: "embed",
							provider: event.target.value === "vimeo" ? "vimeo" : "youtube",
							url: "",
						})
					}
					aria-label="Embed provider"
					className={inputClass}
				>
					<option value="youtube">YouTube</option>
					<option value="vimeo">Vimeo</option>
				</select>
			</Field>
			<Field label="URL" hint="Paste the public video page URL">
				<input
					type="url"
					value={block.url}
					onChange={(event) => onChange({ ...block, url: event.target.value })}
					aria-label="Embed URL"
					className={inputClass}
				/>
			</Field>
			<Field label="Title" hint="Optional, for screen readers">
				<input
					type="text"
					value={block.title ?? ""}
					onChange={(event) => onChange({ ...block, title: event.target.value })}
					aria-label="Embed title"
					className={inputClass}
				/>
			</Field>
		</div>
	);
}

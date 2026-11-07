"use client";

import { SVG_ACCEPT } from "@/components/admin/block-fields/media-accept";
import { DimensionFields } from "@/components/admin/dimension-fields";
import { Field, inputClass } from "@/components/admin/field";
import { MediaInput } from "@/components/admin/media-input";
import type { ArticleBlock } from "@/lib/articles/schema";

export function SvgFields({
	block,
	onChange,
}: {
	block: Extract<ArticleBlock, { type: "svg" }>;
	onChange: (block: ArticleBlock) => void;
}) {
	return (
		<div className="flex flex-col gap-3">
			<MediaInput
				label="SVG"
				value={block.url}
				onChange={(url) => onChange({ ...block, url })}
				accept={SVG_ACCEPT}
			/>
			<div className="grid gap-3 sm:grid-cols-2">
				<Field label="Alt text">
					<input
						type="text"
						value={block.alt ?? ""}
						onChange={(event) => onChange({ ...block, alt: event.target.value })}
						aria-label="SVG alt text"
						className={inputClass}
					/>
				</Field>
				<Field label="Caption">
					<input
						type="text"
						value={block.caption ?? ""}
						onChange={(event) =>
							onChange({ ...block, caption: event.target.value })
						}
						aria-label="SVG caption"
						className={inputClass}
					/>
				</Field>
			</div>
			<DimensionFields
				width={block.width}
				height={block.height}
				onChange={({ width, height }) => onChange({ ...block, width, height })}
			/>
		</div>
	);
}

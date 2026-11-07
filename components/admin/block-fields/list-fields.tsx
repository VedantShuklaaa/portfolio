"use client";

import { Field, inputClass } from "@/components/admin/field";
import type { ArticleBlock } from "@/lib/articles/schema";

export function ListFields({
	block,
	onChange,
}: {
	block: Extract<ArticleBlock, { type: "list" }>;
	onChange: (block: ArticleBlock) => void;
}) {
	return (
		<div className="flex flex-col gap-3">
			<label className="flex items-center gap-2 text-sm">
				<input
					type="checkbox"
					checked={block.ordered ?? false}
					onChange={(event) =>
						onChange({ ...block, ordered: event.target.checked })
					}
				/>
				Ordered list
			</label>
			<Field label="Items" hint="One item per line">
				<textarea
					value={block.items.join("\n")}
					onChange={(event) =>
						onChange({ ...block, items: event.target.value.split("\n") })
					}
					aria-label="List items"
					className={`${inputClass} min-h-28`}
				/>
			</Field>
		</div>
	);
}

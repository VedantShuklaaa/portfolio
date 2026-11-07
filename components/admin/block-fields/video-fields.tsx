"use client";

import {
	RASTER_ACCEPT,
	VIDEO_ACCEPT,
} from "@/components/admin/block-fields/media-accept";
import { Field, inputClass } from "@/components/admin/field";
import { MediaInput } from "@/components/admin/media-input";
import type { ArticleBlock } from "@/lib/articles/schema";

export function VideoFields({
	block,
	onChange,
}: {
	block: Extract<ArticleBlock, { type: "video" }>;
	onChange: (block: ArticleBlock) => void;
}) {
	return (
		<div className="flex flex-col gap-3">
			<MediaInput
				label="Video"
				value={block.url}
				onChange={(url) => onChange({ ...block, url })}
				accept={VIDEO_ACCEPT}
				hint="MP4 or WebM"
			/>
			<MediaInput
				label="Poster"
				value={block.poster ?? ""}
				onChange={(poster) =>
					onChange({ ...block, poster: poster || undefined })
				}
				accept={RASTER_ACCEPT}
				hint="Optional"
			/>
			<Field label="Caption">
				<input
					type="text"
					value={block.caption ?? ""}
					onChange={(event) =>
						onChange({ ...block, caption: event.target.value })
					}
					aria-label="Video caption"
					className={inputClass}
				/>
			</Field>
		</div>
	);
}

"use client";

import {
	RASTER_ACCEPT,
	SVG_ACCEPT,
	VIDEO_ACCEPT,
} from "@/components/admin/block-fields/media-accept";
import { DimensionFields } from "@/components/admin/dimension-fields";
import { Field, inputClass } from "@/components/admin/field";
import { MediaInput } from "@/components/admin/media-input";
import type {
	ArticleBlock,
	ArticleMedia,
} from "@/lib/articles/schema";

function emptyMedia(type: ArticleMedia["type"]): ArticleMedia {
	switch (type) {
		case "image":
		case "video":
		case "svg":
			return { type, url: "" };
	}
}

export function CoverFields({
	block,
	onChange,
}: {
	block: Extract<ArticleBlock, { type: "cover" }>;
	onChange: (block: ArticleBlock) => void;
}) {
	const media = block.media;

	return (
		<div className="flex flex-col gap-3">
			<Field label="Media type">
				<select
					value={media.type}
					onChange={(event) =>
						onChange({
							...block,
							media: emptyMedia(
								event.target.value === "video"
									? "video"
									: event.target.value === "svg"
										? "svg"
										: "image",
							),
						})
					}
					aria-label="Cover media type"
					className={inputClass}
				>
					<option value="image">Image</option>
					<option value="video">Video</option>
					<option value="svg">SVG</option>
				</select>
			</Field>

			{media.type === "video" ? (
				<>
					<MediaInput
						label="Video"
						value={media.url}
						onChange={(url) => onChange({ ...block, media: { ...media, url } })}
						accept={VIDEO_ACCEPT}
					/>
					<MediaInput
						label="Poster"
						value={media.poster ?? ""}
						onChange={(poster) =>
							onChange({
								...block,
								media: { ...media, poster: poster || undefined },
							})
						}
						accept={RASTER_ACCEPT}
						hint="Optional"
					/>
				</>
			) : (
				<>
					<MediaInput
						label={media.type === "svg" ? "SVG" : "Image"}
						value={media.url}
						onChange={(url) => onChange({ ...block, media: { ...media, url } })}
						accept={media.type === "svg" ? SVG_ACCEPT : RASTER_ACCEPT}
					/>
					<Field label="Alt text">
						<input
							type="text"
							value={media.alt ?? ""}
							onChange={(event) =>
								onChange({
									...block,
									media: { ...media, alt: event.target.value },
								})
							}
							aria-label="Cover alt text"
							className={inputClass}
						/>
					</Field>
					<DimensionFields
						width={media.width}
						height={media.height}
						onChange={({ width, height }) =>
							onChange({ ...block, media: { ...media, width, height } })
						}
					/>
				</>
			)}

			<Field label="Caption">
				<input
					type="text"
					value={block.caption ?? ""}
					onChange={(event) =>
						onChange({ ...block, caption: event.target.value })
					}
					aria-label="Cover caption"
					className={inputClass}
				/>
			</Field>
		</div>
	);
}

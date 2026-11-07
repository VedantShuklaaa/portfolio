"use client";

import Link from "next/link";

import { BlockEditor } from "@/components/admin/block-editor";
import { Field, inputClass } from "@/components/admin/field";
import { MediaInput } from "@/components/admin/media-input";
import type { EditableArticle, EditorBlock } from "@/components/admin/types";
import type { ArticleStatus } from "@/lib/supabase/database.types";

const RASTER_ACCEPT = "image/png,image/jpeg,image/webp,image/gif";

const primaryButtonClass =
	"rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60";

export type ArticleEditorFormProps = {
	article?: EditableArticle;
	title: string;
	slug: string;
	description: string;
	status: ArticleStatus;
	tags: string;
	thumbnailUrl: string;
	thumbnailAlt: string;
	blocks: EditorBlock[];
	message: { kind: "error" | "ok"; text: string } | null;
	saving: boolean;
	deleting: boolean;
	onTitleChange: (value: string) => void;
	onSlugChange: (value: string) => void;
	onDescriptionChange: (value: string) => void;
	onStatusChange: (value: ArticleStatus) => void;
	onTagsChange: (value: string) => void;
	onThumbnailUrlChange: (value: string) => void;
	onThumbnailAltChange: (value: string) => void;
	onBlocksChange: (blocks: EditorBlock[]) => void;
	onSubmit: () => void;
	onDelete: () => void;
};

export function ArticleEditorForm({
	article,
	title,
	slug,
	description,
	status,
	tags,
	thumbnailUrl,
	thumbnailAlt,
	blocks,
	message,
	saving,
	deleting,
	onTitleChange,
	onSlugChange,
	onDescriptionChange,
	onStatusChange,
	onTagsChange,
	onThumbnailUrlChange,
	onThumbnailAltChange,
	onBlocksChange,
	onSubmit,
	onDelete,
}: ArticleEditorFormProps) {
	return (
		<form
			className="mt-8 flex flex-col gap-6"
			onSubmit={(event) => {
				event.preventDefault();
				onSubmit();
			}}
		>
			<Field label="Title">
				<input
					type="text"
					value={title}
					onChange={(event) => onTitleChange(event.target.value)}
					aria-label="Article title"
					required
					maxLength={200}
					className={inputClass}
				/>
			</Field>

			<Field label="Slug" hint="Lowercase letters, numbers and hyphens">
				<input
					type="text"
					value={slug}
					onChange={(event) => onSlugChange(event.target.value)}
					aria-label="Article slug"
					required
					maxLength={80}
					className={`${inputClass} font-mono text-xs`}
				/>
			</Field>

			<Field
				label="Description"
				hint="Optional. Shown in the list and at the top of the article."
			>
				<textarea
					value={description}
					onChange={(event) => onDescriptionChange(event.target.value)}
					aria-label="Article description"
					maxLength={500}
					className={`${inputClass} min-h-24`}
				/>
			</Field>

			<div className="grid gap-4 sm:grid-cols-2">
				<Field label="Status">
					<select
						value={status}
						onChange={(event) =>
							onStatusChange(
								event.target.value === "published" ? "published" : "draft",
							)
						}
						aria-label="Article status"
						className={inputClass}
					>
						<option value="draft">Draft</option>
						<option value="published">Published</option>
					</select>
				</Field>
				<Field label="Tags" hint="Comma separated, up to 10">
					<input
						type="text"
						value={tags}
						onChange={(event) => onTagsChange(event.target.value)}
						aria-label="Article tags"
						className={inputClass}
					/>
				</Field>
			</div>

			<div className="flex flex-col gap-3 rounded-xl border border-border p-4">
				<p className="font-heading text-sm font-medium">Thumbnail</p>
				<MediaInput
					label="Thumbnail"
					value={thumbnailUrl}
					onChange={onThumbnailUrlChange}
					accept={RASTER_ACCEPT}
					hint="Optional. Shown in the writings list."
				/>
				<Field label="Alt text">
					<input
						type="text"
						value={thumbnailAlt}
						onChange={(event) => onThumbnailAltChange(event.target.value)}
						aria-label="Thumbnail alt text"
						className={inputClass}
					/>
				</Field>
			</div>

			<BlockEditor blocks={blocks} onChange={onBlocksChange} />

			{message ? (
				<p
					role={message.kind === "error" ? "alert" : "status"}
					className="font-mono text-xs text-muted-foreground"
				>
					{message.text}
				</p>
			) : null}

			<div className="flex flex-wrap items-center gap-3">
				<button
					type="submit"
					disabled={saving || deleting}
					className={primaryButtonClass}
				>
					{saving ? "Saving…" : article ? "Save changes" : "Create article"}
				</button>

				{article && status === "published" ? (
					<Link
						href={`/writings/${slug}`}
						target="_blank"
						rel="noreferrer"
						className="font-mono text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
					>
						View article
					</Link>
				) : null}

				{article ? (
					<button
						type="button"
						onClick={onDelete}
						disabled={saving || deleting}
						className="ml-auto font-mono text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline disabled:opacity-60"
					>
						{deleting ? "Deleting…" : "Delete article"}
					</button>
				) : null}
			</div>
		</form>
	);
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { ArticleEditorForm } from "@/components/admin/article-editor-form";
import type { EditableArticle, EditorBlock } from "@/components/admin/types";
import {
	ArticleInputSchema,
	parseArticleContent,
} from "@/lib/articles/schema";
import {
	deleteArticleRequest,
	normalizeBlock,
	parseTags,
	saveArticle,
} from "@/lib/articles/client";
import { slugify } from "@/lib/articles/slug";
import type { ArticleStatus } from "@/lib/supabase/database.types";

export function ArticleEditor({ article }: { article?: EditableArticle }) {
	const router = useRouter();

	const [initial] = useState(() => {
		const parsed = parseArticleContent(article?.content);
		return {
			blocks: parsed.blocks.map((block) => ({
				key: crypto.randomUUID(),
				block,
			})),
			invalid: parsed.invalidBlocks,
		};
	});

	const [title, setTitle] = useState(article?.title ?? "");
	const [slug, setSlug] = useState(article?.slug ?? "");
	const slugEdited = useRef(Boolean(article));
	const [description, setDescription] = useState(article?.description ?? "");
	const [tags, setTags] = useState(() => (article?.tags ?? []).join(", "));
	const [status, setStatus] = useState<ArticleStatus>(
		article?.status ?? "draft",
	);
	const [thumbnailUrl, setThumbnailUrl] = useState(
		article?.thumbnail?.url ?? "",
	);
	const [thumbnailAlt, setThumbnailAlt] = useState(
		article?.thumbnail?.alt ?? "",
	);
	const [blocks, setBlocks] = useState<EditorBlock[]>(initial.blocks);

	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [message, setMessage] = useState<{
		kind: "error" | "ok";
		text: string;
	} | null>(null);

	function handleTitle(value: string) {
		setTitle(value);
		if (!slugEdited.current) setSlug(slugify(value));
	}

	async function save() {
		setMessage(null);
		setSaving(true);

		try {
			const payload = {
				title: title.trim(),
				slug: slug.trim(),
				description: description.trim() || null,
				thumbnail: thumbnailUrl.trim()
					? {
							url: thumbnailUrl.trim(),
							alt: thumbnailAlt.trim() || undefined,
						}
					: null,
				content: {
					schemaVersion: 1,
					blocks: blocks.map((item) => normalizeBlock(item.block)),
				},
				tags: parseTags(tags),
				status,
			};

			const parsed = ArticleInputSchema.safeParse(payload);
			if (!parsed.success) {
				const issue = parsed.error.issues[0];
				const path = issue.path.join(".");
				setMessage({
					kind: "error",
					text: `Invalid article: ${path ? `${path} — ` : ""}${issue.message}`,
				});
				return;
			}

			const result = await saveArticle(parsed.data, article?.id);
			if (!result.ok) {
				setMessage({ kind: "error", text: result.message });
				return;
			}

			if (!article) {
				if (!result.id) {
					setMessage({
						kind: "error",
						text: "The article was created, but the response was invalid.",
					});
					return;
				}
				router.replace(`/admin/articles/${result.id}`);
				router.refresh();
				return;
			}

			setMessage({ kind: "ok", text: "Saved." });
			router.refresh();
		} catch {
			setMessage({
				kind: "error",
				text: "Could not save the article. Check your connection.",
			});
		} finally {
			setSaving(false);
		}
	}

	async function remove() {
		if (!article) return;
		if (!window.confirm("Delete this article? This cannot be undone.")) return;

		setMessage(null);
		setDeleting(true);

		try {
			const result = await deleteArticleRequest(article.id);
			if (!result.ok) {
				setMessage({ kind: "error", text: result.message });
				return;
			}

			router.push("/admin");
			router.refresh();
		} catch {
			setMessage({
				kind: "error",
				text: "Could not delete the article. Check your connection.",
			});
		} finally {
			setDeleting(false);
		}
	}

	return (
		<main className="mx-auto w-full max-w-[640px] px-5 py-16 sm:py-24">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<h1 className="text-2xl sm:text-3xl">
					{article ? "Edit article" : "New article"}
				</h1>
				<Link
					href="/admin"
					className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
				>
					← Articles
				</Link>
			</div>

			{initial.invalid > 0 ? (
				<p className="mt-4 font-mono text-xs text-muted-foreground">
					{initial.invalid} block{initial.invalid === 1 ? "" : "s"} could not be
					loaded and will be removed if you save.
				</p>
			) : null}

			<ArticleEditorForm
				article={article}
				title={title}
				slug={slug}
				description={description}
				status={status}
				tags={tags}
				thumbnailUrl={thumbnailUrl}
				thumbnailAlt={thumbnailAlt}
				blocks={blocks}
				message={message}
				saving={saving}
				deleting={deleting}
				onTitleChange={handleTitle}
				onSlugChange={(value) => {
					setSlug(value);
					slugEdited.current = true;
				}}
				onDescriptionChange={setDescription}
				onStatusChange={setStatus}
				onTagsChange={setTags}
				onThumbnailUrlChange={setThumbnailUrl}
				onThumbnailAltChange={setThumbnailAlt}
				onBlocksChange={setBlocks}
				onSubmit={() => void save()}
				onDelete={() => void remove()}
			/>
		</main>
	);
}

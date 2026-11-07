"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteArticleButton({
	id,
	title,
}: {
	id: string;
	title: string;
}) {
	const router = useRouter();
	const [deleting, setDeleting] = useState(false);

	async function remove() {
		if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) return;

		setDeleting(true);
		try {
			const response = await fetch(`/api/admin/articles/${id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				window.alert("Could not delete the article.");
				return;
			}

			router.refresh();
		} catch {
			window.alert("Could not delete the article.");
		} finally {
			setDeleting(false);
		}
	}

	return (
		<button
			type="button"
			onClick={() => void remove()}
			disabled={deleting}
			className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-60"
		>
			{deleting ? "Deleting…" : "Delete"}
		</button>
	);
}

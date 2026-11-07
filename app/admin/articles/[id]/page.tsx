import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

import { AdminFallback } from "@/components/admin/admin-fallback";
import { ArticleEditor } from "@/components/admin/article-editor";
import { getArticleForAdmin } from "@/lib/articles/repository";
import { getAdminContext } from "@/lib/auth/admin";

// The editor depends on the request's auth cookies and route params, so this
// segment opts out of static-shell validation and renders per request.
export const instant = false;

const UUID_PATTERN =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type PageProps = {
	params: Promise<{ id: string }>;
};

async function EditArticleGate({ params }: PageProps) {
	const context = await getAdminContext();
	if (!context) redirect("/admin/login");

	const { id } = await params;
	if (!UUID_PATTERN.test(id)) notFound();

	const article = await getArticleForAdmin(context.supabase, id);
	if (!article) notFound();

	return (
		<ArticleEditor
			article={{
				id: article.id,
				title: article.title,
				slug: article.slug,
				description: article.description,
				thumbnail: article.thumbnail,
				content: article.content,
				tags: article.tags,
				status: article.status,
			}}
		/>
	);
}

export default function EditArticlePage({ params }: PageProps) {
	return (
		<Suspense fallback={<AdminFallback />}>
			<EditArticleGate params={params} />
		</Suspense>
	);
}

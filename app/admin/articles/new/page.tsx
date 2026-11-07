import { redirect } from "next/navigation";
import { Suspense } from "react";

import { AdminFallback } from "@/components/admin/admin-fallback";
import { ArticleEditor } from "@/components/admin/article-editor";
import { getAdminContext } from "@/lib/auth/admin";

async function NewArticleGate() {
	const context = await getAdminContext();
	if (!context) redirect("/admin/login");
	return <ArticleEditor />;
}

export default function NewArticlePage() {
	return (
		<Suspense fallback={<AdminFallback />}>
			<NewArticleGate />
		</Suspense>
	);
}

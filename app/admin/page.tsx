import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { AdminFallback } from "@/components/admin/admin-fallback";
import { DeleteArticleButton } from "@/components/admin/delete-article-button";
import { LogoutButton } from "@/components/admin/logout-button";
import { listArticlesForAdmin } from "@/lib/articles/repository";
import { getAdminContext } from "@/lib/auth/admin";
import { formatArticleDate } from "@/lib/dates";

const newArticleClass =
	"rounded-lg bg-primary px-3 py-1.5 text-sm text-primary-foreground outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const rowActionClass =
	"font-mono text-xs text-muted-foreground transition-colors hover:text-foreground";

async function AdminDashboard() {
	const context = await getAdminContext();
	if (!context) redirect("/admin/login");

	const articles = await listArticlesForAdmin(context.supabase);

	return (
		<>
			<div className="flex h-screen flex-wrap items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl sm:text-3xl">Articles</h1>
					<p className="mt-1 font-mono text-xs text-muted-foreground">
						{context.user.email}
					</p>
				</div>
				<div className="flex items-center gap-4">
					<Link href="/admin/articles/new" className={newArticleClass}>
						New article
					</Link>
					<LogoutButton />
				</div>
			</div>

			{articles.length === 0 ? (
				<p className="mt-10 text-[15px] text-muted-foreground">
					No articles yet. Create the first one.
				</p>
			) : (
				<ul className="mt-10 border-t border-border">
					{articles.map((article) => (
						<li
							key={article.id}
							className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border py-4"
						>
							<div className="min-w-0">
								<p className="flex flex-wrap items-baseline gap-2">
									<Link
										href={`/admin/articles/${article.id}`}
										className="font-heading text-base font-medium underline-offset-4 hover:underline"
									>
										{article.title}
									</Link>
									<span className="font-mono text-xs text-muted-foreground">
										{article.status}
									</span>
								</p>
								<p className="mt-1 font-mono text-xs text-muted-foreground">
									/{article.slug} · updated {formatArticleDate(article.updatedAt)}
								</p>
							</div>

							<div className="flex items-center gap-4">
								{article.status === "published" ? (
									<Link
										href={`/writings/${article.slug}`}
										target="_blank"
										rel="noreferrer"
										className={rowActionClass}
									>
										View
									</Link>
								) : null}
								<Link
									href={`/admin/articles/${article.id}`}
									className={rowActionClass}
								>
									Edit
								</Link>
								<DeleteArticleButton id={article.id} title={article.title} />
							</div>
						</li>
					))}
				</ul>
			)}
		</>
	);
}

export default function AdminPage() {
	return (
		<main className="mx-auto w-full max-w-[640px] px-5 py-16 sm:py-24">
			<Suspense fallback={<AdminFallback />}>
				<AdminDashboard />
			</Suspense>
		</main>
	);
}

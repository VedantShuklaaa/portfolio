import Image from "next/image";
import Link from "next/link";

import type { ArticleSummary } from "@/lib/articles/repository";
import { formatArticleDate } from "@/lib/dates";
import { cn } from "@/lib/utils";

export function ArticleCard({
	article,
	priority = false,
}: {
	article: ArticleSummary;
	priority?: boolean;
}) {
	const thumbnail = article.thumbnail;

	return (
		<article
			className={cn(
				"group relative flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground transition-colors focus-within:ring-2 focus-within:ring-ring hover:border-foreground/25",
				thumbnail && "aspect-[3/3.5] sm:aspect-[3/4]",
			)}
		>
			{thumbnail ? (
				<div className="relative h-[60%] overflow-hidden bg-muted">
					<Image
						src={thumbnail.url}
						alt={thumbnail.alt ?? article.title}
						fill
						priority={priority}
						sizes="(min-width: 640px) 312px, 50vw"
						className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-[1.03]"
					/>
				</div>
			) : null}

			<div
				className={cn(
					"flex flex-col gap-1.5 p-3 sm:p-4",
					thumbnail && "h-[40%]",
				)}
			>
				{article.publishedAt ? (
					<time
						dateTime={article.publishedAt}
						className="text-xs text-muted-foreground tabular-nums"
					>
						{formatArticleDate(article.publishedAt)}
					</time>
				) : null}
				<h2 className="line-clamp-2 font-heading text-lg leading-snug font-medium tracking-tight sm:text-[0.9375rem]">
					{/* The stretched link makes the whole tile clickable with one focusable element */}
					<Link
						href={`/writings/${article.slug}`}
						className="outline-none after:absolute after:inset-0 after:content-['']"
					>
						{article.title}
					</Link>
				</h2>
				{article.description ? (
					<p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground sm:line-clamp-3 sm:text-[0.8125rem]">
						{article.description}
					</p>
				) : null}
			</div>
		</article>
	);
}

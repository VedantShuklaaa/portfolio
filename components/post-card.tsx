import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/posts";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
	year: "numeric",
	timeZone: "UTC",
});

export function PostCard({ post, priority = false }: { post: Post; priority?: boolean }) {
	return (
		<article className="group relative aspect-[3/4.5] overflow-hidden rounded-xl border bg-card text-card-foreground transition-colors focus-within:ring-2 focus-within:ring-ring hover:border-foreground/25 sm:aspect-[3/4]">
			{/* Image: top 60% */}
			<div className="relative h-[60%] overflow-hidden bg-muted">
				<Image
					src={post.image}
					alt={post.imageAlt}
					fill
					priority={priority}
					sizes="(min-width: 640px) 312px, 50vw"
					className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-[1.03]"
				/>
			</div>

			{/* Text: bottom 40% */}
			<div className="flex h-[40%] flex-col gap-1.5 p-3 sm:p-4">
				<time
					dateTime={post.date}
					className="hidden text-xs text-muted-foreground sm:block"
				>
					{dateFormatter.format(new Date(post.date))}
				</time>
				<h2 className="line-clamp-2 text-[0.8125rem] leading-snug sm:text-[0.9375rem]">
					{/* The stretched link makes the whole tile clickable with one focusable element */}
					<Link
						href={`/writings/${post.slug}`}
						className="outline-none after:absolute after:inset-0 after:content-['']"
					>
						{post.title}
					</Link>
				</h2>
				<p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:line-clamp-3 sm:text-[0.8125rem]">
					{post.description}
				</p>
			</div>
		</article>
	);
}
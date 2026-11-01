import type { Metadata } from "next";
import { PostCard } from "@/components/post-card";
import { posts } from "@/lib/posts";
import { Typewriter } from "@/components/typewriter";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";
const title = "Writings";
const description =
	"What broke, what worked, and what I learned building in Rust and Solana.";

export const metadata: Metadata = {
	title,
	description,
	alternates: { canonical: "/writings" },
	openGraph: {
		type: "website",
		url: `${siteUrl}/writings`,
		title,
		description,
		images: posts[0] ? [{ url: posts[0].image }] : undefined,
	},
	twitter: { card: "summary_large_image", title, description },
};

export default function WritingsPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Blog",
		name: title,
		description,
		url: `${siteUrl}/writings`,
		blogPost: posts.map((p) => ({
			"@type": "BlogPosting",
			headline: p.title,
			description: p.description,
			datePublished: p.date,
			image: `${siteUrl}${p.image}`,
			url: `${siteUrl}/writings/${p.slug}`,
		})),
	};

	return (
		<main className="mx-auto w-full max-w-[640px] px-5 py-16 sm:py-24">
			<header className="mb-10 sm:mb-12">
				<h1 className="text-2xl sm:text-3xl">
					<Typewriter text="~/ Writings" />
				</h1>
				<p className="mt-2 max-w-[48ch] text-muted-foreground">
					<Typewriter text={description} />
				</p>
			</header>

			{posts.length > 0 ? (
				<section aria-label="All posts" className="grid grid-cols-2 gap-3 sm:gap-4">
					{posts.map((post, i) => (
						<PostCard key={post.slug} post={post} priority={i < 2} />
					))}
				</section>
			) : (
				<p className="text-muted-foreground">Nothing published yet. Check back soon.</p>
			)}

			<script
				type="application/ld+json"
				// Escape "<" so post content can never close the script tag
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
			/>
		</main>
	);
}
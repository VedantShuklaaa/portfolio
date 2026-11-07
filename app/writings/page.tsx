import type { Metadata } from "next";
import { Suspense } from "react";

import { ArticleCard } from "@/components/article-card";
import { ArticleListSkeleton } from "@/components/articles/article-list-skeleton";
import { Typewriter } from "@/components/typewriter";
import { listPublishedArticles } from "@/lib/articles/repository";
import { absoluteUrl, serializeJsonLd } from "@/lib/seo";
import { RSS_ALTERNATE, AUTHOR, SITE_NAME, SITE_URL } from "@/lib/site";

// The list reads Supabase at request time. Opting out of static-shell
// validation keeps builds working before environment variables are configured
// and lets the inline Suspense skeleton handle the wait.
export const instant = false;

const title = "Writings";
const description =
	"What broke, what worked, and what I learned building in Rust and Solana.";

export const metadata: Metadata = {
	title,
	description,
	alternates: { canonical: "/writings", types: RSS_ALTERNATE },
	openGraph: {
		type: "website",
		url: `${SITE_URL}/writings`,
		siteName: SITE_NAME,
		title,
		description,
	},
	twitter: { card: "summary_large_image", title, description },
};

async function ArticlesList() {
	const articles = await listPublishedArticles();

	if (articles.length === 0) {
		return (
			<p className="text-muted-foreground">
				Nothing published yet. Check back soon.
			</p>
		);
	}

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Blog",
		"@id": `${SITE_URL}/writings#blog`,
		name: title,
		description,
		url: `${SITE_URL}/writings`,
		inLanguage: "en",
		author: { "@type": "Person", name: AUTHOR.name, url: SITE_URL },
		blogPost: articles.map((article) => ({
			"@type": "BlogPosting",
			headline: article.title,
			description: article.description,
			datePublished: article.publishedAt,
			dateModified: article.updatedAt,
			author: { "@type": "Person", name: AUTHOR.name, url: SITE_URL },
			image: article.thumbnail
				? absoluteUrl(article.thumbnail.url)
				: `${SITE_URL}/writings/${article.slug}/opengraph-image`,
			url: `${SITE_URL}/writings/${article.slug}`,
			mainEntityOfPage: `${SITE_URL}/writings/${article.slug}`,
		})),
	};

	return (
		<>
			<section
				aria-label="All posts"
				className="grid sm:grid-cols-2 gap-2 sm:gap-4"
			>
				{articles.map((article, index) => (
					<ArticleCard
						key={article.id}
						article={article}
						priority={index < 2}
					/>
				))}
			</section>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
			/>
		</>
	);
}

export default function WritingsPage() {
	return (
		<main className="mx-auto h-screen w-full max-w-[640px] px-5 py-16 sm:py-24">
			<header className="mb-10 sm:mb-12">
				<h1 className="text-2xl sm:text-3xl">
					<Typewriter text="~/ Writings" />
				</h1>
				<p className="mt-2 max-w-[48ch] text-muted-foreground">
					<Typewriter text={description} />
				</p>
			</header>

			<Suspense fallback={<ArticleListSkeleton />}>
				<ArticlesList />
			</Suspense>
		</main>
	);
}

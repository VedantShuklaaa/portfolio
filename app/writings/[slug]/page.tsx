import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleRenderer } from "@/components/articles/article-renderer";
import {
	getPublishedArticleBySlug,
	type FullArticle,
} from "@/lib/articles/repository";
import { formatArticleDate } from "@/lib/dates";
import { absoluteUrl, serializeJsonLd } from "@/lib/seo";
import { AUTHOR, RSS_ALTERNATE, SITE_NAME, SITE_URL } from "@/lib/site";

type PageProps = {
	params: Promise<{ slug: string }>;
};

// The lookup runs on the request path, so this segment opts out of static-shell
// validation. The proxy checks the slug separately so missing and unpublished
// articles get a real 404 status instead of a streamed 200 shell; for the same
// reason the writings list keeps its skeleton in page-level Suspense rather
// than a segment-level loading.tsx.
export const instant = false;

function articleDescription(article: FullArticle): string {
	return (
		article.description ?? `A technical write-up by ${AUTHOR.name}.`
	);
}

function openGraphImage(article: FullArticle) {
	if (article.thumbnail) {
		return {
			url: absoluteUrl(article.thumbnail.url),
			width: 1200,
			height: 630,
			alt: article.thumbnail.alt ?? article.title,
		};
	}

	return {
		url: `/writings/${article.slug}/opengraph-image`,
		width: 1200,
		height: 630,
		alt: article.title,
	};
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params;

	let article: FullArticle | null = null;
	try {
		article = await getPublishedArticleBySlug(slug);
	} catch {
		return {
			title: "Writings",
			robots: { index: false, follow: false },
		};
	}

	if (!article) {
		return {
			title: "Article not found",
			robots: { index: false, follow: false },
		};
	}

	const description = articleDescription(article);
	const publishedTime = article.publishedAt ?? undefined;

	return {
		title: article.title,
		description,
		alternates: {
			canonical: `/writings/${article.slug}`,
			types: RSS_ALTERNATE,
		},
		openGraph: {
			type: "article",
			url: `${SITE_URL}/writings/${article.slug}`,
			siteName: SITE_NAME,
			title: article.title,
			description,
			publishedTime,
			modifiedTime: article.updatedAt,
			authors: [AUTHOR.name],
			tags: article.tags,
			images: [openGraphImage(article)],
		},
		twitter: {
			card: "summary_large_image",
			title: article.title,
			description,
			images: [openGraphImage(article).url],
		},
	};
}

export default async function ArticlePage({ params }: PageProps) {
	const { slug } = await params;
	const article = await getPublishedArticleBySlug(slug);

	if (!article) notFound();

	const url = `${SITE_URL}/writings/${article.slug}`;
	const description = articleDescription(article);
	const publishedTime = article.publishedAt ?? article.updatedAt;
	const image = openGraphImage(article);

	const jsonLd = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "BlogPosting",
				"@id": `${url}#article`,
				headline: article.title,
				description,
				datePublished: publishedTime,
				dateModified: article.updatedAt,
				inLanguage: "en",
				keywords: article.tags.join(", ") || undefined,
				author: {
					"@type": "Person",
					"@id": `${SITE_URL}/#person`,
					name: AUTHOR.name,
					url: SITE_URL,
				},
				publisher: { "@id": `${SITE_URL}/#person` },
				mainEntityOfPage: { "@type": "WebPage", "@id": url },
				image: [absoluteUrl(image.url)],
				url,
			},
			{
				"@type": "BreadcrumbList",
				itemListElement: [
					{
						"@type": "ListItem",
						position: 1,
						name: "Home",
						item: `${SITE_URL}/`,
					},
					{
						"@type": "ListItem",
						position: 2,
						name: "Writings",
						item: `${SITE_URL}/writings`,
					},
					{
						"@type": "ListItem",
						position: 3,
						name: article.title,
						item: url,
					},
				],
			},
		],
	};

	const updated =
		article.updatedAt !== publishedTime
			? formatArticleDate(article.updatedAt, "long")
			: null;

	return (
		<article className="mx-auto w-full max-w-[640px] px-5 py-16 sm:py-24">
			<nav
				aria-label="Breadcrumb"
				className="mb-8 font-mono text-xs text-muted-foreground"
			>
				<Link href="/" className="transition-colors hover:text-foreground">
					Home
				</Link>
				<span aria-hidden="true"> / </span>
				<Link
					href="/writings"
					className="transition-colors hover:text-foreground"
				>
					Writings
				</Link>
			</nav>

			<header>
				<h1 className="font-heading text-2xl font-medium tracking-tight text-balance sm:text-3xl">
					{article.title}
				</h1>
				<p className="mt-3 font-mono text-xs text-muted-foreground">
					By{" "}
					<Link href="/" className="transition-colors hover:text-foreground">
						{AUTHOR.name}
					</Link>{" "}
					· Published{" "}
					<time dateTime={publishedTime}>
						{formatArticleDate(publishedTime, "long")}
					</time>
					{updated ? (
						<>
							{" "}
							· Updated <time dateTime={article.updatedAt}>{updated}</time>
						</>
					) : null}
				</p>
				{article.tags.length > 0 ? (
					<p className="mt-2 font-mono text-xs text-muted-foreground">
						{article.tags.join(" · ")}
					</p>
				) : null}
			</header>

			{article.description ? (
				<p className="mt-8 text-[15px] leading-relaxed text-muted-foreground">
					{article.description}
				</p>
			) : null}

			{article.thumbnail ? (
				<div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted">
					<Image
						src={article.thumbnail.url}
						alt={article.thumbnail.alt ?? article.title}
						fill
						priority
						sizes="(min-width: 640px) 600px, 100vw"
						className="object-cover"
					/>
				</div>
			) : null}

			<ArticleRenderer content={article.content} />

			<p className="mt-12 font-mono text-xs">
				<Link
					href="/writings"
					className="text-muted-foreground transition-colors hover:text-foreground"
				>
					← All writings
				</Link>
			</p>

			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
			/>
		</article>
	);
}

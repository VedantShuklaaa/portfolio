import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getPost, posts } from "@/lib/posts";
import { serializeJsonLd } from "@/lib/seo";
import { AUTHOR, RSS_ALTERNATE, SITE_NAME, SITE_URL } from "@/lib/site";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
	month: "long",
	day: "numeric",
	year: "numeric",
	timeZone: "UTC",
});

type PageProps = {
	params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
	return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const post = getPost(slug);

	if (!post) return {};

	const url = `${SITE_URL}/writings/${post.slug}`;

	return {
		title: post.title,
		description: post.description,
		alternates: { canonical: `/writings/${post.slug}`, types: RSS_ALTERNATE },
		openGraph: {
			type: "article",
			url,
			siteName: SITE_NAME,
			title: post.title,
			description: post.description,
			publishedTime: post.date,
			modifiedTime: post.date,
			authors: [AUTHOR.name],
			images: [
				{
					url: `/writings/${post.slug}/opengraph-image`,
					width: 1200,
					height: 630,
					alt: post.imageAlt,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: post.title,
			description: post.description,
		},
	};
}

export default async function PostPage({ params }: PageProps) {
	const { slug } = await params;
	const post = getPost(slug);

	if (!post) notFound();

	const url = `${SITE_URL}/writings/${post.slug}`;

	const jsonLd = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "BlogPosting",
				"@id": `${url}#article`,
				headline: post.title,
				description: post.description,
				datePublished: post.date,
				dateModified: post.date,
				inLanguage: "en",
				author: {
					"@type": "Person",
					"@id": `${SITE_URL}/#person`,
					name: AUTHOR.name,
					url: SITE_URL,
				},
				publisher: { "@id": `${SITE_URL}/#person` },
				mainEntityOfPage: { "@type": "WebPage", "@id": url },
				image: [`${url}/opengraph-image`],
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
						name: post.title,
						item: url,
					},
				],
			},
		],
	};

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
					{post.title}
				</h1>
				<p className="mt-3 font-mono text-xs text-muted-foreground">
					By{" "}
					<Link href="/" className="transition-colors hover:text-foreground">
						{AUTHOR.name}
					</Link>{" "}
					· Updated{" "}
					<time dateTime={post.date}>
						{dateFormatter.format(new Date(post.date))}
					</time>
				</p>
			</header>

			<p className="mt-8 text-[15px] leading-relaxed text-muted-foreground">
				{post.description}
			</p>

			<div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-lg bg-muted">
				<Image
					src={post.image}
					alt={post.imageAlt}
					fill
					priority
					sizes="(min-width: 640px) 600px, 100vw"
					className="object-cover"
				/>
			</div>

			<p className="mt-8 text-[15px] leading-relaxed">
				The full write-up is in progress. Notes on the details will be
				published here once they are ready.
			</p>

			<p className="mt-10 font-mono text-xs">
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

import type { MetadataRoute } from "next";

import { listPublishedArticles } from "@/lib/articles/repository";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	let articles: Awaited<ReturnType<typeof listPublishedArticles>> = [];
	try {
		articles = await listPublishedArticles();
	} catch {
		articles = [];
	}

	const lastModified = articles.length
		? new Date(articles[0].updatedAt)
		: new Date();

	return [
		{
			url: `${SITE_URL}/`,
			lastModified,
			changeFrequency: "monthly",
			priority: 1,
		},
		{
			url: `${SITE_URL}/writings`,
			lastModified,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		...articles.map((article) => ({
			url: `${SITE_URL}/writings/${article.slug}`,
			lastModified: new Date(article.updatedAt),
			changeFrequency: "monthly" as const,
			priority: 0.6,
		})),
	];
}

import type { MetadataRoute } from "next";

import { posts } from "@/lib/posts";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
	const newestPost = posts[0]?.date;
	const lastModified = newestPost ? new Date(newestPost) : new Date(0);

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
		...posts.map((post) => ({
			url: `${SITE_URL}/writings/${post.slug}`,
			lastModified: new Date(post.date),
			changeFrequency: "monthly" as const,
			priority: 0.6,
		})),
	];
}

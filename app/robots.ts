import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

const AI_CRAWLERS = [
	"GPTBot",
	"OAI-SearchBot",
	"ClaudeBot",
	"PerplexityBot",
	"Google-Extended",
	"CCBot",
];

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/api/", "/admin/"],
			},
			...AI_CRAWLERS.map((userAgent) => ({
				userAgent,
				allow: "/",
			})),
		],
		sitemap: `${SITE_URL}/sitemap.xml`,
		host: SITE_URL,
	};
}

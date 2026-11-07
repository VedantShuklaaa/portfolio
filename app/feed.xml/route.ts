import { listPublishedArticles } from "@/lib/articles/repository";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const XML_ENTITIES: Record<string, string> = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&apos;",
};

function escapeXml(value: string): string {
	return value.replace(/[&<>"']/g, (char) => XML_ENTITIES[char] ?? char);
}

export async function GET() {
	let articles;
	try {
		articles = await listPublishedArticles();
	} catch {
		return new Response("The feed is temporarily unavailable.", {
			status: 503,
			headers: { "Content-Type": "text/plain; charset=utf-8" },
		});
	}

	const newest = articles[0]?.publishedAt ?? articles[0]?.updatedAt;

	const items = articles
		.map((article) => {
			const url = `${SITE_URL}/writings/${article.slug}`;
			const published = article.publishedAt ?? article.updatedAt;

			return `<item>
	<title>${escapeXml(article.title)}</title>
	<link>${escapeXml(url)}</link>
	<guid isPermaLink="true">${escapeXml(url)}</guid>
	<description>${escapeXml(article.description ?? "")}</description>
	<pubDate>${new Date(published).toUTCString()}</pubDate>
</item>`;
		})
		.join("\n");

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
	<title>${escapeXml(SITE_NAME)} — Writings</title>
	<link>${SITE_URL}/writings</link>
	<description>${escapeXml(SITE_DESCRIPTION)}</description>
	<language>en</language>
	<atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
	${newest ? `<lastBuildDate>${new Date(newest).toUTCString()}</lastBuildDate>` : ""}
${items}
</channel>
</rss>`;

	return new Response(xml, {
		headers: {
			"Content-Type": "application/rss+xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600, s-maxage=86400",
		},
	});
}

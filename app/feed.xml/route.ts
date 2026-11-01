import { posts } from "@/lib/posts";
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

export function GET() {
	const newest = posts[0]?.date;

	const items = posts
		.map((post) => {
			const url = `${SITE_URL}/writings/${post.slug}`;

			return `<item>
	<title>${escapeXml(post.title)}</title>
	<link>${escapeXml(url)}</link>
	<guid isPermaLink="true">${escapeXml(url)}</guid>
	<description>${escapeXml(post.description)}</description>
	<pubDate>${new Date(post.date).toUTCString()}</pubDate>
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

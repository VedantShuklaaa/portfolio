import { SITE_URL } from "@/lib/site";

/**
 * Serialize JSON-LD for a script tag. Escaping "<" prevents a string value
 * from closing the script element early.
 */
export function serializeJsonLd(data: unknown): string {
	return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** Absolute URL for metadata images that may be stored site-relative. */
export function absoluteUrl(path: string): string {
	return /^https?:\/\//i.test(path) ? path : `${SITE_URL}${path}`;
}

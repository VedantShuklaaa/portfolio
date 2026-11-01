/**
 * Serialize JSON-LD for a script tag. Escaping "<" prevents a string value
 * from closing the script element early.
 */
export function serializeJsonLd(data: unknown): string {
	return JSON.stringify(data).replace(/</g, "\\u003c");
}

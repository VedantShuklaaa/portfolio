const shortFormatter = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
	year: "numeric",
	timeZone: "UTC",
});

const longFormatter = new Intl.DateTimeFormat("en-US", {
	month: "long",
	day: "numeric",
	year: "numeric",
	timeZone: "UTC",
});

export function formatArticleDate(
	value: string,
	style: "short" | "long" = "short",
): string {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return style === "long"
		? longFormatter.format(date)
		: shortFormatter.format(date);
}

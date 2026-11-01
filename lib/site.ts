const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vedantshukla.in";

/** Canonical site origin, without a trailing slash. */
export const SITE_URL = configuredSiteUrl.replace(/\/+$/, "");

export const SITE_NAME = "Vedant Shukla";

export const DEFAULT_TITLE =
	"Vedant Shukla | Backend & Blockchain Developer (Rust, Solana)";

export const SITE_DESCRIPTION =
	"Backend and blockchain developer building low-latency Rust and Solana systems, real-time indexers and distributed infrastructure.";

export const AUTHOR = {
	name: "Vedant Shukla",
	jobTitle: "Backend & Blockchain Developer",
	url: SITE_URL,
} as const;

export const X_HANDLE = "@SegFault_Dev";

export const SOCIAL_LINKS = {
	github: "https://github.com/VedantShuklaaa",
	x: "https://x.com/SegFault_Dev",
	linkedin: "https://www.linkedin.com/in/vedant-shukla-17a953239",
} as const;

export const SAME_AS = [
	SOCIAL_LINKS.github,
	SOCIAL_LINKS.x,
	SOCIAL_LINKS.linkedin,
];

export const PROJECTS_URL = "https://projects.vedantshukla.in";

export const RSS_ALTERNATE = { "application/rss+xml": "/feed.xml" } as const;

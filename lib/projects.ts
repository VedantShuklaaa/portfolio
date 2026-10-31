export const PROJECTS_URL = "https://projects.vedantshukla.in";

export type Project = {
	slug: string;
	name: string;
	description: string;
	href: string;
};

export const projects: Project[] = [
	{
		slug: "lobster",
		name: "lobster",
		description: "limit order book in Rust",
		href: PROJECTS_URL,
	},
	{
		slug: "bridge-indexer",
		name: "bridge-indexer",
		description: "Solana bridge transaction indexer",
		href: PROJECTS_URL,
	},
	{
		slug: "cdn",
		name: "cdn",
		description: "edge caching and DNS routing, built from scratch",
		href: PROJECTS_URL,
	},
	{
		slug: "perc",
		name: "perc",
		description: "split LSTs into principal and yield tokens",
		href: PROJECTS_URL,
	},
];

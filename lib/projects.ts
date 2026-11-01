export const PROJECTS_URL = "https://projects.vedantshukla.in";

export type Project = {
	slug: string;
	name: string;
	description: string;
	href: string;
	flow: string[];
	tags: string[];
	image?: string;
};

export const projects: Project[] = [
	{
		slug: "lobster",
		name: "lobster",
		description: "limit order book in Rust",
		href: `${PROJECTS_URL}/lobster`,
		flow: ["gen", "engine", "bench"],
		tags: ["rust", "cargo workspace"],
		image: "/lobster.png",
	},
	{
		slug: "bridge-indexer",
		name: "bridge-indexer",
		description: "Solana bridge transaction indexer",
		href: `${PROJECTS_URL}/`,
		flow: ["helius", "redis", "indexer", "postgres"],
		tags: ["rust", "axum", "postgres"],
	},
	{
		slug: "streamex-sdk",
		name: "streamex-sdk",
		description: "Unified realtime crypto streams for JavaScript applications",
		href: `${PROJECTS_URL}/streamex-sdk`,
		flow: ["exchanges", "streamex-sdk", "your app"],
		tags: ["javascript", "websockets"],
		image: "/streamex.png",
	},
];
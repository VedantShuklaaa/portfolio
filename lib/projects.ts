import { PROJECTS_URL } from "@/lib/site";

export { PROJECTS_URL };

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
		slug: "hermit",
		name: "hermit",
		description: "Solana bridge transaction indexer",
		href: `${PROJECTS_URL}/hermit`,
		flow: ["helius", "redis", "indexer", "postgres"],
		tags: ["rust", "axum", "postgres"],
		image: "/projects/hermit.png"
	}, {
		slug: "lobster",
		name: "lobster",
		description: "limit order book in Rust",
		href: `${PROJECTS_URL}/lobster`,
		flow: ["gen", "engine", "bench"],
		tags: ["rust", "cargo workspace"],
		image: "/projects/lobster.png",
	}, {
		slug: "mantis",
		name: "mantis",
		description: "Solana devnet token with a faucet and a live MAN/SOL AMM pool",
		href: `${PROJECTS_URL}/mantis`,
		flow: ["faucet", "man mint", "amm pool", "chart"],
		tags: ["rust", "anchor", "solana", "next.js"],
		image: "/projects/mantis.png",
	}, {
		slug: "streamex-sdk",
		name: "streamex-sdk",
		description: "Unified realtime crypto streams for JavaScript applications",
		href: `${PROJECTS_URL}/streamex-sdk`,
		flow: ["exchanges", "streamex-sdk", "your app"],
		tags: ["javascript", "websockets"],
		image: "/projects/streamex.png",
	},
];
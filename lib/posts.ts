export type Post = {
	slug: string;
	title: string;
	description: string;
	/** ISO date, e.g. 2026-10-15 */
	date: string;
	/** Path under /public. Use 4:3 or wider; it is cropped to fill the top 60% of the tile. */
	image: string;
	imageAlt: string;
};

// Replace with real posts (or load from MDX / a CMS). Newest first.
export const posts: Post[] = [
	{
		slug: "building-a-limit-order-book-in-rust",
		title: "Building a limit order book in Rust",
		description: "Matching engine design, data structures, and the numbers behind the live demo.",
		date: "2026-10-15",
		image: "/writings/limit-order-book.webp",
		imageAlt: "Depth chart of a live limit order book",
	},
	{
		slug: "indexing-wormhole-bridges",
		title: "Indexing Wormhole bridges in real time",
		description: "Streaming Solana and EVM events into Postgres and Redis Streams.",
		date: "2026-10-30",
		image: "/writings/bridge-indexer.webp",
		imageAlt: "Diagram of cross-chain events flowing into an indexer",
	},
	{
		slug: "scroll-driven-cards",
		title: "Scroll-driven cards without jank",
		description: "How I built the stacked card reveal on a marketing landing page.",
		date: "2026-08-24",
		image: "/writings/scroll-cards.webp",
		imageAlt: "Stack of cards animating on scroll",
	},
	{
		slug: "solana-pdas-and-atas",
		title: "PDAs and ATAs, finally explained",
		description: "Notes from reading the SPL Token-Swap program line by line.",
		date: "2026-09-25",
		image: "/writings/pdas-atas.webp",
		imageAlt: "Illustration of program derived addresses",
	},
].sort((a, b) => +new Date(b.date) - +new Date(a.date));
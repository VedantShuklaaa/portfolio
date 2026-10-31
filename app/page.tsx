import type { Metadata } from "next";

import Hero from "@/components/landing/hero";

const description =
	"Vedant Shukla is a Rust backend developer building low-latency systems and Web3 infrastructure.";

export const metadata: Metadata = {
	title: { absolute: "Vedant Shukla — Rust Backend Developer" },
	description,
	alternates: { canonical: "/" },
	openGraph: {
		type: "website",
		url: "/",
		siteName: "Vedant Shukla",
		title: "Vedant Shukla — Rust Backend Developer",
		description,
	},
	twitter: {
		card: "summary",
		title: "Vedant Shukla — Rust Backend Developer",
		description,
	},
};

const person = {
	"@context": "https://schema.org",
	"@type": "Person",
	name: "Vedant Shukla",
	url: "https://vedantshukla.in",
	jobTitle: "Backend Developer",
	description,
	sameAs: ["https://github.com/VedantShuklaaa"],
	knowsAbout: ["Rust", "Web3", "Low-latency systems", "Next.js", "TypeScript"],
};

export default function Home() {
	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
			/>
			<Hero />
		</>
	);
}

import type { Metadata } from "next";

import Hero from "@/components/landing/hero";
import { LandingBody } from "@/components/landing-body";
import { Skills } from "@/components/skills";
import { Socials } from "@/components/socials";
import {
	DEFAULT_TITLE,
	RSS_ALTERNATE,
	SITE_DESCRIPTION,
	SITE_NAME,
} from "@/lib/site";

const description = SITE_DESCRIPTION;

export const metadata: Metadata = {
	title: { absolute: DEFAULT_TITLE },
	description,
	alternates: { canonical: "/", types: RSS_ALTERNATE },
	openGraph: {
		type: "website",
		url: "/",
		siteName: SITE_NAME,
		title: DEFAULT_TITLE,
		description,
	},
	twitter: {
		card: "summary_large_image",
		title: DEFAULT_TITLE,
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
			<LandingBody />
			<Skills />
			<Socials />
		</>
	);
}

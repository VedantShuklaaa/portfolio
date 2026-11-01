import type { Metadata } from "next";

import Hero from "@/components/landing/hero";
import { LandingBody } from "@/components/landing-body";
import { Skills } from "@/components/skills";
import { Socials } from "@/components/socials";
import {
	DEFAULT_TITLE,
	RSS_ALTERNATE,
	SAME_AS,
	SITE_DESCRIPTION,
	SITE_NAME,
	SITE_URL,
} from "@/lib/site";
import { serializeJsonLd } from "@/lib/seo";

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
	"@graph": [
		{
			"@type": "Person",
			"@id": `${SITE_URL}/#person`,
			name: SITE_NAME,
			url: SITE_URL,
			jobTitle: "Backend & Blockchain Developer",
			description,
			sameAs: SAME_AS,
			knowsAbout: [
				"Rust",
				"Solana",
				"Backend development",
				"Distributed systems",
				"Low-latency systems",
				"Wormhole bridges",
			],
		},
		{
			"@type": "WebSite",
			"@id": `${SITE_URL}/#website`,
			url: SITE_URL,
			name: SITE_NAME,
			description,
			inLanguage: "en",
			publisher: { "@id": `${SITE_URL}/#person` },
		},
	],
};

export default function Home() {
	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: serializeJsonLd(person) }}
			/>
			<Hero />
			<LandingBody />
			<Skills />
			<Socials />
		</>
	);
}

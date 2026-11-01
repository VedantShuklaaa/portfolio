"use client";

import {
	GithubIcon,
	LinkedinIcon,
	TwitterIcon,
} from "@animateicons/react/lucide";
import { SOCIAL_LINKS } from "@/lib/site";
import { TerminalPrompt } from "./terminal-prompt";
import { m } from "framer-motion";

const ICON_SIZE = 20;
const ICON_DURATION = 1;

const SOCIALS = [
	{ label: "X (Twitter)", href: SOCIAL_LINKS.x, Icon: TwitterIcon },
	{ label: "LinkedIn", href: SOCIAL_LINKS.linkedin, Icon: LinkedinIcon },
	{ label: "GitHub", href: SOCIAL_LINKS.github, Icon: GithubIcon },
	//{ label: "Discord", href: "https://discord.gg/your-invite", Icon: DiscordIcon },
];

export function Socials() {
	const iconColor = "currentColor";

	return (
		<m.section
			initial={{ opacity: 0, y: 6 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.2 }}
			aria-labelledby="socials-heading"
		>
			<h2 id="socials-heading" className="mb-3 font-mono text-sm">
				<TerminalPrompt command="ls ~/Connect with me on" />
			</h2>

			<ul className="flex flex-wrap items-center gap-2">
				{SOCIALS.map(({ label, href, Icon }) => (
					<li key={label}>
						<a
							href={href}
							target="_blank"
							rel="me noopener noreferrer"
							aria-label={label}
							className="flex items-center justify-center rounded-lg border border-black/15 text-foreground dark:border-white/15 p-2 outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
						>
							<Icon size={ICON_SIZE} duration={ICON_DURATION} color={iconColor} />
						</a>
					</li>
				))}
			</ul>
		</m.section>
	);
}
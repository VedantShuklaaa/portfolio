import { Typewriter } from "./typewriter";

const SKILLS: string[] = [
	"Next.js",
	"TypeScript",
	"Tailwind CSS",
	"Framer Motion",
	"GSAP",
	"Lenis",
	"Rust",
	"Axum",
	"Tokio",
	"sqlx",
	"PostgreSQL",
	"Redis",
	"WebSockets",
	"Solana",
	"Anchor",
];

export function Skills() {
	return (
		<section aria-labelledby="skills-heading" className="pb-28">
			<h2 id="skills-heading" className="mb-3 font-mono text-xs">
				<Typewriter text="~/ Skills" />
			</h2>

			{/* Parent: rounded-xl, different bg from the page (bg-muted vs bg-background) */}
			<ul className="flex flex-wrap gap-2 rounded-xl bg-muted p-2">
				{SKILLS.map((skill) => (
					<li
						key={skill}
						className="rounded-md bg-card border border-black/15 dark:border-white/15 p-2 text-xs leading-none text-foreground sm:text-[0.8125rem] cursor-pointer hover:scale-105 duration-400"
					>
						{skill}
					</li>
				))}
			</ul>
		</section>
	);
}
"use client"
import { TerminalPrompt } from "./terminal-prompt";
import { m } from "framer-motion";

const SKILLS: string[] = [
	// Rust & backend
	"Rust",
	"Axum",
	"Tokio",
	"SQLx",
	"Node.js",
	"Express.js",
	"WebSockets",
	"Event-Driven Architecture",
	"Distributed Systems",
	"Real-Time Streaming",
	"Pub/Sub Systems",
	"Low-Latency Backend Design",
	// Databases & messaging
	"PostgreSQL",
	"MongoDB",
	"Redis",
	"Apache Kafka",
	// Auth & validation
	"JWT",
	"OAuth 2.0",
	"Zod",
	// Cloud & DevOps
	"Docker",
	"AWS (EC2, S3, CloudFront, IAM)",
	"CI/CD",
	"Nginx",
	"Linux",
	// Blockchain / Web3
	"Solana",
	"Anchor Framework",
	"Web3.js",
	"Ethers.js",
	// Languages & frontend
	"TypeScript",
	"JavaScript (ES2023+)",
	"React.js",
	"Next.js",
	"Tailwind CSS",
	"shadcn/ui",
	"Framer Motion",
];

export function Skills() {
	return (
		<m.section
			initial={{ opacity: 0, y: 6 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.2 }}
			aria-labelledby="skills-heading"
			className="pb-28"
		>
			<h2 id="skills-heading" className="mb-3 font-mono text-sm">
				<TerminalPrompt command="ls ~/Skills" />
			</h2>

			{/* Parent: rounded-xl, different bg from the page (bg-muted vs bg-background) */}
			<ul className="flex flex-wrap gap-2 rounded-xl bg-muted p-2">
				{SKILLS.map((skill) => (
					<li
						key={skill}
						className="rounded-md bg-card border border-black/15 dark:border-white/15 p-2 text-xs leading-none text-foreground sm:text-[0.8125rem]"
					>
						{skill}
					</li>
				))}
			</ul>
		</m.section>
	);
}
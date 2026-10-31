"use client";

import { m, type Variants } from "framer-motion";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
	hidden: {},
	visible: {
		transition: { staggerChildren: 0.05 },
	},
};

const item: Variants = {
	hidden: { opacity: 0, y: 6 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.35, ease },
	},
};

const linkClass =
	"inline-flex items-center gap-1 rounded-sm text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

const resumeUrl = process.env.NEXT_PUBLIC_RESUME_URL;

export default function Hero() {
	return (
		<section
			aria-labelledby="hero-name"
			className="flex flex-col justify-start pb-32 pt-24"
		>
			<m.div
				variants={container}
				initial="hidden"
				animate="visible"
				className="flex max-w-full px-2 flex-col gap-6"
			>
				<m.div variants={item} className="flex flex-col gap-2">
					<h1
						id="hero-name"
						className="font-heading text-3xl font-medium tracking-tight text-balance"
					>
						~/ Vedant Shukla
					</h1>
					<p className="font-mono text-xs text-muted-foreground">
						Rust · Web3 · low-latency systems
					</p>
				</m.div>

				<m.p
					variants={item}
					className="text-[15px] leading-relaxed text-pretty text-muted-foreground"
				>
					I’m a backend developer who works mostly in Rust, focused on
					building fast, reliable systems where latency and throughput matter.
					I’ve scaled backends to 35k requests per second, and I care about
					clean architecture, understanding things at a low level, and
					measuring before optimizing. I also work across the stack with
					Next.js and TypeScript.
				</m.p>

				<m.div
					variants={item}
					className="flex flex-wrap items-center gap-x-5 gap-y-2"
				>
					<a
						href="https://github.com/VedantShuklaaa"
						className={linkClass}
					>
						GitHub
						<span aria-hidden="true">↗</span>
					</a>
					<a
						href="https://projects.vedantshukla.in"
						className={linkClass}
					>
						Projects
						<span aria-hidden="true">↗</span>
					</a>
					{resumeUrl && (
						<a
							href={resumeUrl}
							target="_blank"
							rel="noopener noreferrer"
							className={linkClass}
						>
							Resume
							<span aria-hidden="true">↗</span>
							<span className="sr-only"> (opens in a new tab)</span>
						</a>
					)}
				</m.div>
			</m.div>
		</section>
	);
}

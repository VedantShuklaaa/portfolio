"use client";
import { motion } from "framer-motion";
import { LucideHome, Folder, Briefcase, ToolCase, LucideIcon } from "lucide-react";
import Link from "next/link";

interface Links {
	title: LucideIcon;
	href: string;
	label: string
}

export default function Navbar() {
	const link: Links[] = [
		{ title: LucideHome, href: "/", label: "Home" },
		{ title: Folder, href: "", label: "Projects" },
		{ title: Briefcase, href: "", label: "Experience" },
		{ title: ToolCase, href: "", label: "Tools" },
	]

	return (
		<motion.nav className="relative flex h-12 px-5 items-center justify-center rounded-xl border bg-card font-sans">
			<div className="flex relative items-center gap-6">
				{link.map((items, idx) => {
					let Icon = items.title
					return (
						<Link
							href={items.href}
							key={idx}
							prefetch
							className="text-lg p-1 transition-colors hover:bg-foreground rounded-md hover:text-secondary"
							aria-label={items.label}
						>
							<Icon size={20} />
						</Link>)
				})}
			</div>

		</motion.nav>
	)
}
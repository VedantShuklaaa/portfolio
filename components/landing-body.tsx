"use client";
import { NowTerminal } from "@/components/now-terminal";
import { ProjectsTerminal } from "@/components/projects-terminal";
import { Reveal } from "@/components/reveal";
import { TerminalCursor } from "@/components/terminal-cursor";
import { m } from "framer-motion";

export function LandingBody() {
	return (
		<m.div
			initial={{ opacity: 0, y: 6 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.2 }}
			className="flex flex-col gap-10 px-2 pb-[12vh]">
			<Reveal delay={0}>
				<ProjectsTerminal />
			</Reveal>
			<Reveal delay={0.05}>
				<NowTerminal />
			</Reveal>
			<Reveal delay={0.1}>
				<TerminalCursor />
			</Reveal>
		</m.div>
	);
}

import { NowTerminal } from "@/components/now-terminal";
import { ProjectsTerminal } from "@/components/projects-terminal";
import { Reveal } from "@/components/reveal";
import { TerminalCursor } from "@/components/terminal-cursor";

export function LandingBody() {
	return (
		<div className="flex flex-col gap-10 px-2 pb-[12vh]">
			<Reveal delay={0}>
				<ProjectsTerminal />
			</Reveal>
			<Reveal delay={0.05}>
				<NowTerminal />
			</Reveal>
			<Reveal delay={0.1}>
				<TerminalCursor />
			</Reveal>
		</div>
	);
}

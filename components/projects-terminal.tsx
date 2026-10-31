import { TerminalPrompt } from "@/components/terminal-prompt";
import { projects } from "@/lib/projects";

export function ProjectsTerminal() {
	return (
		<section className="flex flex-col gap-3">
			<h2 className="sr-only">Projects</h2>
			<TerminalPrompt command="ls ~/projects" />
			<ul className="group/list flex flex-col gap-1">
				{projects.map((project) => (
					<li key={project.slug}>
						<a
							href={project.href}
							className="group/row flex flex-col gap-y-0.5 rounded-sm py-1 transition-opacity duration-300 group-hover/list:not-hover:opacity-40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:grid sm:grid-cols-[8rem_minmax(0,1fr)_auto] sm:items-baseline sm:gap-x-4 sm:gap-y-0"
						>
							<span className="font-mono text-[13px] text-foreground">
								{project.name}
							</span>
							<span className="text-sm text-muted-foreground">
								{project.description}
							</span>
							<span
								aria-hidden="true"
								className="hidden -translate-x-1 text-sm text-muted-foreground opacity-0 transition duration-300 group-hover/row:translate-x-0 group-hover/row:opacity-100 group-focus-visible/row:translate-x-0 group-focus-visible/row:opacity-100 sm:inline sm:justify-self-end"
							>
								↗
							</span>
						</a>
					</li>
				))}
			</ul>
		</section>
	);
}

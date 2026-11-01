import { Fragment } from "react";

import type { Project } from "@/lib/projects";

type ProjectPreviewDiagramProps = Pick<Project, "name" | "flow" | "tags">;

export function ProjectPreviewDiagram({
	name,
	flow,
	tags,
}: ProjectPreviewDiagramProps) {
	return (
		<div className="flex flex-col gap-3 px-3 py-3">
			<p className="font-heading text-sm font-medium tracking-tight text-foreground">
				{name}
			</p>
			<div className="flex flex-wrap items-center gap-1">
				{flow.map((step, index) => (
					<Fragment key={step}>
						{index > 0 && (
							<span className="text-[10px] text-muted-foreground">→</span>
						)}
						<span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
							{step}
						</span>
					</Fragment>
				))}
			</div>
			<p className="font-mono text-[10px] text-muted-foreground">
				{tags.join(" · ")}
			</p>
		</div>
	);
}
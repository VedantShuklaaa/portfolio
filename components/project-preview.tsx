import { ProjectPreviewDiagram } from "@/components/project-preview-diagram";
import { ProjectPreviewImage } from "@/components/project-preview-image";
import type { Project } from "@/lib/projects";

type ProjectPreviewProps = {
	project: Pick<Project, "slug" | "name" | "flow" | "tags" | "image">;
};

export function ProjectPreview({ project }: ProjectPreviewProps) {
	return (
		<div
			aria-hidden="true"
			className="pointer-events-none absolute right-0 bottom-full z-10 mb-2 hidden w-72 origin-bottom-right translate-y-1 scale-[0.98] overflow-hidden rounded-lg border border-border bg-background opacity-0 transition delay-75 duration-300 group-hover/row:translate-y-0 group-hover/row:scale-100 group-hover/row:opacity-100 group-focus-visible/row:translate-y-0 group-focus-visible/row:scale-100 group-focus-visible/row:opacity-100 motion-reduce:translate-y-0 motion-reduce:scale-100 md:block"
		>
			<div className="border-b border-border px-3 py-1.5 font-mono text-[10px] text-muted-foreground">
				~/projects/{project.slug}
			</div>
			{project.image ? (
				<ProjectPreviewImage src={project.image} />
			) : (
				<ProjectPreviewDiagram
					name={project.name}
					flow={project.flow}
					tags={project.tags}
				/>
			)}
		</div>
	);
}
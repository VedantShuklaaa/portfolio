import type { ReactNode } from "react";

export function BlockFigure({
	children,
	caption,
}: {
	children: ReactNode;
	caption?: string;
}) {
	return (
		<figure className="m-0">
			<div className="overflow-hidden rounded-lg border border-border bg-muted">
				{children}
			</div>
			{caption ? (
				<figcaption className="mt-2 font-mono text-xs text-muted-foreground">
					{caption}
				</figcaption>
			) : null}
		</figure>
	);
}

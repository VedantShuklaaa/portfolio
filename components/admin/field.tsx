import type { ReactNode } from "react";

export const inputClass =
	"w-full rounded-lg border border-border bg-background px-3 py-2 text-[15px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring";

export function Field({
	label,
	hint,
	children,
}: {
	label: string;
	hint?: string;
	children: ReactNode;
}) {
	return (
		<div className="flex flex-col gap-1.5">
			<span className="font-mono text-xs text-muted-foreground">{label}</span>
			{children}
			{hint ? (
				<span className="text-xs text-muted-foreground">{hint}</span>
			) : null}
		</div>
	);
}

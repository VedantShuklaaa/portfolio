"use client";

import { Field, inputClass } from "@/components/admin/field";

function parseDimension(value: string): number | undefined {
	if (!value.trim()) return undefined;
	const parsed = Number(value);
	return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
}

export function DimensionFields({
	width,
	height,
	onChange,
}: {
	width?: number;
	height?: number;
	onChange: (next: { width?: number; height?: number }) => void;
}) {
	return (
		<div className="grid gap-3 sm:grid-cols-2">
			<Field label="Width" hint="Optional, in pixels">
				<input
					type="number"
					min={1}
					value={width ?? ""}
					onChange={(event) =>
						onChange({ width: parseDimension(event.target.value), height })
					}
					aria-label="Media width"
					className={inputClass}
				/>
			</Field>
			<Field label="Height" hint="Optional, in pixels">
				<input
					type="number"
					min={1}
					value={height ?? ""}
					onChange={(event) =>
						onChange({ width, height: parseDimension(event.target.value) })
					}
					aria-label="Media height"
					className={inputClass}
				/>
			</Field>
		</div>
	);
}

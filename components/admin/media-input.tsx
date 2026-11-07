"use client";

import { useRef, useState } from "react";

import { Field, inputClass } from "@/components/admin/field";
import { cn } from "@/lib/utils";

type UploadResponse = {
	file?: {
		url?: unknown;
	};
	error?: {
		message?: unknown;
	};
};

function uploadErrorMessage(value: unknown): string {
	if (value && typeof value === "object") {
		const body = value as UploadResponse;
		if (typeof body.error?.message === "string") return body.error.message;
	}
	return "Upload failed";
}

export function MediaInput({
	label,
	value,
	onChange,
	accept,
	hint,
}: {
	label: string;
	value: string;
	onChange: (url: string) => void;
	accept: string;
	hint?: string;
}) {
	const fileInput = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleFile(file: File) {
		setError(null);
		setUploading(true);

		try {
			const formData = new FormData();
			formData.append("file", file);

			const response = await fetch("/api/admin/upload", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				const errorBody: unknown = await response.json().catch(() => null);
				setError(uploadErrorMessage(errorBody));
				return;
			}

			const data: unknown = await response.json().catch(() => null);
			const body = data as UploadResponse | null;
			const url = body?.file?.url;

			if (typeof url !== "string") {
				setError(uploadErrorMessage(data));
				return;
			}

			onChange(url);
		} catch {
			setError("Upload failed");
		} finally {
			setUploading(false);
			if (fileInput.current) fileInput.current.value = "";
		}
	}

	return (
		<Field label={label} hint={hint}>
			<div className="flex flex-col gap-2">
				<input
					type="url"
					inputMode="url"
					value={value}
					onChange={(event) => onChange(event.target.value)}
					aria-label={`${label} URL`}
					placeholder="https://…"
					className={inputClass}
				/>

				<div className="flex flex-wrap items-center gap-3">
					<input
						ref={fileInput}
						type="file"
						accept={accept}
						aria-label={`Upload ${label}`}
						className="sr-only"
						onChange={(event) => {
							const file = event.target.files?.[0];
							if (file) void handleFile(file);
						}}
					/>
					<button
						type="button"
						disabled={uploading}
						onClick={() => fileInput.current?.click()}
						className={cn(
							"rounded-lg border border-border px-3 py-1.5 text-sm text-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
							uploading && "cursor-not-allowed opacity-60",
						)}
					>
						{uploading ? "Uploading…" : "Upload file"}
					</button>
					{value ? (
						<button
							type="button"
							onClick={() => onChange("")}
							className="font-mono text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
						>
							Remove
						</button>
					) : null}
				</div>

				{error ? (
					<p role="alert" className="text-xs text-muted-foreground">
						{error}
					</p>
				) : null}

				{value && /\.(png|jpe?g|webp|gif)(?:$|[?#])/i.test(value) ? (
					/* eslint-disable-next-line @next/next/no-img-element */
					<img
						src={value}
						alt=""
						className="h-24 w-auto max-w-full rounded-lg border border-border object-cover"
					/>
				) : null}
			</div>
		</Field>
	);
}

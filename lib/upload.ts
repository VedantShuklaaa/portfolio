export type UploadKind = "image" | "svg" | "video";

type UploadRule = {
	kind: UploadKind;
	extension: string;
	maxBytes: number;
};

export const ALLOWED_UPLOADS: Record<string, UploadRule> = {
	"image/png": { kind: "image", extension: "png", maxBytes: 10 * 1024 * 1024 },
	"image/jpeg": { kind: "image", extension: "jpg", maxBytes: 10 * 1024 * 1024 },
	"image/webp": { kind: "image", extension: "webp", maxBytes: 10 * 1024 * 1024 },
	"image/gif": { kind: "image", extension: "gif", maxBytes: 10 * 1024 * 1024 },
	"image/svg+xml": { kind: "svg", extension: "svg", maxBytes: 512 * 1024 },
	"video/mp4": { kind: "video", extension: "mp4", maxBytes: 50 * 1024 * 1024 },
	"video/webm": { kind: "video", extension: "webm", maxBytes: 50 * 1024 * 1024 },
};

export const MAX_UPLOAD_BYTES = Math.max(
	...Object.values(ALLOWED_UPLOADS).map((rule) => rule.maxBytes),
);

/** Extra allowance for multipart boundaries and field headers. */
export const MAX_UPLOAD_REQUEST_BYTES = MAX_UPLOAD_BYTES + 1024 * 1024;

function startsWith(bytes: Uint8Array, signature: number[]): boolean {
	if (bytes.length < signature.length) return false;
	return signature.every((byte, index) => bytes[index] === byte);
}

function ascii(bytes: Uint8Array, start: number, length: number): string {
	return String.fromCharCode(...bytes.slice(start, start + length));
}

function looksLikeMp4(bytes: Uint8Array): boolean {
	return bytes.length > 12 && ascii(bytes, 4, 4) === "ftyp";
}

function looksLikeWebm(bytes: Uint8Array): boolean {
	return startsWith(bytes, [0x1a, 0x45, 0xdf, 0xa3]);
}

const DANGEROUS_SVG = [
	/<\s*script\b/i,
	/<\s*foreignObject\b/i,
	/<\s*iframe\b/i,
	/<\s*object\b/i,
	/<\s*embed\b/i,
	/<\s*!ENTITY\b/i,
	/\son[a-z]+\s*=/i,
	/javascript\s*:/i,
	/(?:href|xlink:href)\s*=\s*["']\s*(?:https?:|data:)/i,
];

function isSafeSvg(bytes: Uint8Array): boolean {
	let source: string;
	try {
		source = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
	} catch {
		return false;
	}

	const trimmed = source.replace(/^﻿/, "").trimStart();
	if (!trimmed.startsWith("<svg") && !trimmed.startsWith("<?xml")) {
		return false;
	}
	if (!/<svg[\s>]/i.test(trimmed)) return false;

	return !DANGEROUS_SVG.some((pattern) => pattern.test(source));
}

function contentMatchesMime(
	declared: string,
	bytes: Uint8Array,
): boolean {
	switch (declared) {
		case "image/png":
			return startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
		case "image/jpeg":
			return startsWith(bytes, [0xff, 0xd8, 0xff]);
		case "image/gif":
			return ascii(bytes, 0, 6) === "GIF87a" || ascii(bytes, 0, 6) === "GIF89a";
		case "image/webp":
			return ascii(bytes, 0, 4) === "RIFF" && ascii(bytes, 8, 4) === "WEBP";
		case "image/svg+xml":
			return isSafeSvg(bytes);
		case "video/mp4":
			return looksLikeMp4(bytes);
		case "video/webm":
			return looksLikeWebm(bytes);
		default:
			return false;
	}
}

export type ValidatedUpload = {
	kind: UploadKind;
	extension: string;
	contentType: string;
	maxBytes: number;
};

export type UploadValidation =
	| { ok: true; upload: ValidatedUpload }
	| { ok: false; reason: "type" | "size" | "content" | "filename" };

export function validateUpload(file: File): UploadValidation {
	const declared = file.type.toLowerCase();
	const rule = ALLOWED_UPLOADS[declared];
	if (!rule) return { ok: false, reason: "type" };
	if (file.size === 0) return { ok: false, reason: "size" };
	if (file.size > rule.maxBytes) return { ok: false, reason: "size" };

	// The uploaded filename is never used for the storage path, but a name
	// containing path separators is a clear sign of an abusive request.
	if (
		file.name.includes("/") ||
		file.name.includes("\\") ||
		file.name.includes("..")
	) {
		return { ok: false, reason: "filename" };
	}

	return { ok: true, upload: { ...rule, contentType: declared } };
}

/** Called after the bytes are read, to check the actual file content. */
export function confirmUploadContent(
	mime: string,
	bytes: Uint8Array,
): boolean {
	return contentMatchesMime(mime, bytes);
}

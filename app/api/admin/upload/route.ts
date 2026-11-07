import type { NextRequest } from "next/server";

import {
	assertSameOrigin,
	jsonError,
	methodNotAllowed,
} from "@/lib/api/http";
import { getAdminContext } from "@/lib/auth/admin";
import { enforceRateLimit } from "@/lib/rate-limit";
import { ARTICLES_BUCKET } from "@/lib/supabase/env";
import {
	MAX_UPLOAD_REQUEST_BYTES,
	confirmUploadContent,
	validateUpload,
} from "@/lib/upload";

export async function POST(request: NextRequest) {
	const originError = assertSameOrigin(request);
	if (originError) return originError;

	const context = await getAdminContext();
	if (!context) return jsonError("unauthorized", "Unauthorized");

	const contentType = request.headers.get("content-type") ?? "";
	if (!contentType.toLowerCase().startsWith("multipart/form-data")) {
		return jsonError(
			"unsupported_media_type",
			"Expected a multipart/form-data upload",
		);
	}

	const declaredLength = Number(request.headers.get("content-length") ?? 0);
	if (
		Number.isFinite(declaredLength) &&
		declaredLength > MAX_UPLOAD_REQUEST_BYTES
	) {
		return jsonError("payload_too_large", "File is too large");
	}

	const limited = await enforceRateLimit(context, "media:upload", 20, 60);
	if (limited) return limited;

	let formData: FormData;
	try {
		formData = await request.formData();
	} catch {
		return jsonError("invalid_request", "Unreadable upload");
	}

	const file = formData.get("file");
	if (!(file instanceof File)) {
		return jsonError("invalid_request", "No file was provided");
	}

	const validation = validateUpload(file);
	if (!validation.ok) {
		switch (validation.reason) {
			case "type":
				return jsonError("unsupported_media_type", "Unsupported file type");
			case "size":
				return jsonError("payload_too_large", "File is too large");
			case "filename":
				return jsonError("invalid_request", "Invalid filename");
			case "content":
				return jsonError("unsupported_media_type", "Unsupported file content");
		}
	}

	const upload = validation.upload;

	let bytes: Uint8Array;
	try {
		bytes = new Uint8Array(await file.arrayBuffer());
	} catch {
		return jsonError("invalid_request", "Unreadable upload");
	}

	if (bytes.byteLength === 0 || bytes.byteLength > upload.maxBytes) {
		return jsonError("payload_too_large", "File is too large");
	}

	if (!confirmUploadContent(upload.contentType, bytes)) {
		return jsonError(
			"unsupported_media_type",
			"File content does not match its declared type",
		);
	}

	// Storage paths are generated here; the uploaded filename is ignored.
	const now = new Date();
	const month = String(now.getUTCMonth() + 1).padStart(2, "0");
	const path = `${now.getUTCFullYear()}/${month}/${crypto.randomUUID()}.${upload.extension}`;

	const { error } = await context.supabase.storage
		.from(ARTICLES_BUCKET)
		.upload(path, bytes, {
			contentType: upload.contentType,
			cacheControl: "31536000",
			upsert: false,
		});

	if (error) {
		console.error("[admin/upload] storage failed", error);
		return jsonError("internal_error", "Could not store the file");
	}

	const { data } = context.supabase.storage
		.from(ARTICLES_BUCKET)
		.getPublicUrl(path);

	return Response.json(
		{
			file: {
				url: data.publicUrl,
				path,
				mime: upload.contentType,
				size: bytes.byteLength,
			},
		},
		{ status: 201, headers: { "Cache-Control": "no-store" } },
	);
}

export function GET() {
	return methodNotAllowed(["POST"]);
}

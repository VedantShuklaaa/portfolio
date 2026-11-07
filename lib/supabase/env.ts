/**
 * Supabase configuration shared by server and browser code.
 *
 * Only the publishable (anon) key is ever used. No service-role key is read
 * anywhere in this project.
 */
export const SUPABASE_URL = (
	process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
).replace(/\/+$/, "");

export const SUPABASE_PUBLISHABLE_KEY =
	process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

/** Public Storage bucket that holds article images, videos and SVGs. */
export const ARTICLES_BUCKET = "article-media";

export function isSupabaseConfigured(): boolean {
	return Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);
}

export function getArticleMediaPublicUrl(path: string): string {
	return `${SUPABASE_URL}/storage/v1/object/public/${ARTICLES_BUCKET}/${path}`;
}

/** Characters allowed in a storage object / site-relative media path. */
const SAFE_PATH = /^[A-Za-z0-9._~%!$&'()*+,;=:@/-]+$/;

function isSafeRelativePath(value: string): boolean {
	if (!value.startsWith("/") || value.startsWith("//")) return false;
	if (value.includes("..") || value.includes("\\")) return false;
	return SAFE_PATH.test(value);
}

/**
 * Media referenced from article JSON must be either a site-relative asset or
 * an object in our public article bucket. This keeps arbitrary remote URLs out
 * of the image pipeline (and out of any server-side fetch).
 */
export function isAllowedMediaUrl(value: string): boolean {
	if (isSafeRelativePath(value)) return true;
	if (!SUPABASE_URL) return false;

	const prefix = `${SUPABASE_URL}/storage/v1/object/public/${ARTICLES_BUCKET}/`;
	if (!value.startsWith(prefix)) return false;
	const path = value.slice(prefix.length);
	return path.length > 0 && !path.includes("..") && SAFE_PATH.test(path);
}

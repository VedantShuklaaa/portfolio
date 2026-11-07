import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

let supabaseOrigin = "";
let supabaseHost = "";
try {
	const configured = process.env.NEXT_PUBLIC_SUPABASE_URL;
	if (configured) {
		const url = new URL(configured);
		supabaseOrigin = url.origin;
		supabaseHost = url.hostname;
	}
} catch {
	// A malformed URL is ignored here; the data layer reports configuration
	// errors at request time.
}

const supabaseConnect = supabaseOrigin
	? `${supabaseOrigin} wss://${supabaseHost}`
	: "";

const csp = [
	"default-src 'self'",
	`script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
	"style-src 'self' 'unsafe-inline'",
	`img-src 'self' data: blob: ${supabaseOrigin}`.trim(),
	`media-src 'self' ${supabaseOrigin}`.trim(),
	"font-src 'self' data:",
	`connect-src 'self' ${supabaseConnect}${isDev ? " ws: wss:" : ""}`.trim(),
	"frame-src https://www.youtube-nocookie.com https://player.vimeo.com",
	"frame-ancestors 'none'",
	"base-uri 'self'",
	"form-action 'self'",
	"object-src 'none'",
].join("; ");

const securityHeaders = [
	{ key: "Content-Security-Policy", value: csp },
	{ key: "X-Content-Type-Options", value: "nosniff" },
	{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
	{
		key: "Permissions-Policy",
		value: "camera=(), microphone=(), geolocation=()",
	},
	{
		key: "Strict-Transport-Security",
		value: "max-age=63072000; includeSubDomains; preload",
	},
	{ key: "Cross-Origin-Opener-Policy", value: "same-origin" },
	{ key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
	cacheComponents: true,
	partialPrefetching: true,
	poweredByHeader: false,
	images: {
		remotePatterns: supabaseHost
			? [
					{
						protocol: "https",
						hostname: supabaseHost,
						pathname: "/storage/v1/object/public/article-media/**",
					},
				]
			: [],
	},
	turbopack: {
		rules: {
			"*.css": {
				loaders: ["@tailwindcss/turbopack"],
				as: "*.css",
			},
		},
	},
	async headers() {
		return [{ source: "/:path*", headers: securityHeaders }];
	},
};

export default nextConfig;

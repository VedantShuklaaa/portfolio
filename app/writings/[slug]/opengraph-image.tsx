import { ImageResponse } from "next/og";

import { getPost } from "@/lib/posts";

export const alt = "Writings — Vedant Shukla";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type ImageProps = {
	params: Promise<{ slug: string }>;
};

export default async function Image({ params }: ImageProps) {
	const { slug } = await params;
	const post = getPost(slug);
	const title = post?.title ?? "Writings";

	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					background: "#0a0a0a",
					color: "#fafafa",
					padding: "72px",
				}}
			>
				<div
					style={{
						display: "flex",
						fontSize: 24,
						letterSpacing: "0.14em",
						color: "#a3a3a3",
					}}
				>
					WRITINGS
				</div>
				<div
					style={{
						display: "flex",
						maxWidth: 1000,
						fontSize: 62,
						fontWeight: 600,
						letterSpacing: "-0.02em",
						lineHeight: 1.12,
					}}
				>
					{title}
				</div>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						fontSize: 24,
						color: "#a3a3a3",
					}}
				>
					<span>Vedant Shukla</span>
					<span>VEDANTSHUKLA.IN</span>
				</div>
			</div>
		),
		{ ...size },
	);
}

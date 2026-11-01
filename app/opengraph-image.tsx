import { ImageResponse } from "next/og";

export const alt = "Vedant Shukla — backend and blockchain developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
				<div style={{ display: "flex", fontSize: 26, letterSpacing: "0.12em", color: "#a3a3a3" }}>
					VEDANTSHUKLA.IN
				</div>
				<div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
					<div style={{ fontSize: 86, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
						Vedant Shukla
					</div>
					<div style={{ fontSize: 38, color: "#d4d4d4" }}>
						Backend &amp; Blockchain Developer
					</div>
					<div style={{ fontSize: 26, color: "#a3a3a3" }}>
						Rust · Solana · Low-latency systems
					</div>
				</div>
				<div style={{ display: "flex", height: 2, background: "#333333" }} />
			</div>
		),
		{ ...size },
	);
}

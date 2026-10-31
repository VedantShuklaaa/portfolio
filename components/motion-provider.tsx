"use client";

import { domMax, LazyMotion, MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

export function MotionProvider({ children }: { children: ReactNode }) {
	return (
		<LazyMotion features={domMax}>
			<MotionConfig reducedMotion="user">{children}</MotionConfig>
		</LazyMotion>
	);
}
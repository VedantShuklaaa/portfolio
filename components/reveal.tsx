"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

type RevealProps = {
	children: ReactNode;
	className?: string;
	delay?: number;
};

export function Reveal({ children, className, delay = 0 }: RevealProps) {
	return (
		<m.div
			initial={{ opacity: 0, y: 6 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "0px 0px -10% 0px" }}
			transition={{ duration: 0.35, ease, delay }}
			className={className}
		>
			{children}
		</m.div>
	);
}

"use client";

import { useInView, useReducedMotion } from "framer-motion";
import { useCallback, useRef, useSyncExternalStore } from "react";

import { useTypewriter } from "@/lib/use-typewriter";
import { cn } from "@/lib/utils";
import styles from "./typewriter.module.css";

// Turbopack loads module CSS as plain CSS here, so exports can be empty.
const cursorBlinkClass = styles.typewriterCursorBlink || "typewriterCursorBlink";

// Server render and hydration use the server snapshot, so the first client
// render always matches the markup React received.
const subscribe = () => () => {};
const getClientHydrated = () => true;
const getServerHydrated = () => false;

type TypewriterTag = "span" | "p" | "h1" | "h2" | "h3" | "h4" | "div";

type TypewriterProps = {
	text: string;
	as?: TypewriterTag;
	className?: string;
	speed?: number;
	delay?: number;
	startOnView?: boolean;
	cursor?: "typing" | "blink" | "none";
};

export function Typewriter({
	text,
	as = "span",
	className,
	speed = 40,
	delay = 0,
	startOnView = true,
	cursor = "typing",
}: TypewriterProps) {
	const elementRef = useRef<HTMLElement | null>(null);
	const setElementRef = useCallback((node: HTMLElement | null) => {
		elementRef.current = node;
	}, []);

	const inView = useInView(elementRef, {
		once: true,
		margin: "0px 0px -10% 0px",
	});
	const prefersReducedMotion = useReducedMotion();
	const hydrated = useSyncExternalStore(
		subscribe,
		getClientHydrated,
		getServerHydrated,
	);
	const reduceMotion = hydrated && prefersReducedMotion === true;

	const enabled = reduceMotion || (startOnView ? inView : true);
	const { typed, rest, done } = useTypewriter(text, {
		speed,
		delay,
		enabled,
		instant: reduceMotion,
	});

	const showCursor =
		!reduceMotion && cursor !== "none" && (cursor === "blink" || !done);

	const Tag = as;

	return (
		<Tag ref={setElementRef} className={className}>
			<span className="sr-only">{text}</span>
			<span aria-hidden="true">
				{typed}
				{showCursor && (
					<span aria-hidden="true" className="relative">
						<span
							className={cn(
								"absolute bottom-0 left-0 block h-[1em] w-[0.5ch] bg-foreground",
								cursor === "blink" && cursorBlinkClass,
							)}
						/>
					</span>
				)}
				<span
					data-rest={rest}
					className="after:invisible after:content-[attr(data-rest)]"
				/>
			</span>
		</Tag>
	);
}

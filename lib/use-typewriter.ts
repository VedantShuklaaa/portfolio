"use client";

import { useEffect, useMemo, useState } from "react";

const MIN_SPEED = 10;

export type TypewriterOptions = {
	speed: number;
	delay: number;
	enabled: boolean;
	instant: boolean;
};

export type TypewriterState = {
	typed: string;
	rest: string;
	done: boolean;
};

const segmenter =
	typeof Intl !== "undefined" && typeof Intl.Segmenter === "function"
		? new Intl.Segmenter(undefined, { granularity: "grapheme" })
		: null;

function splitGraphemes(text: string): string[] {
	if (segmenter) {
		return Array.from(segmenter.segment(text), ({ segment }) => segment);
	}
	return Array.from(text);
}

type Progress = {
	text: string;
	index: number;
};

export function useTypewriter(
	text: string,
	{ speed, delay, enabled, instant }: TypewriterOptions,
): TypewriterState {
	const graphemes = useMemo(() => splitGraphemes(text), [text]);
	const [progress, setProgress] = useState<Progress>({ text, index: 0 });

	// Ignore progress from a previous string so a text change never shows stale output.
	const index = progress.text === text && enabled ? progress.index : 0;
	const complete = enabled && instant;
	const typed = complete ? text : graphemes.slice(0, index).join("");
	const rest = complete ? "" : graphemes.slice(index).join("");
	const done = complete || index >= graphemes.length;

	useEffect(() => {
		if (!enabled || instant || graphemes.length === 0) return;

		const stepDelay = Math.max(MIN_SPEED, speed);
		let timer: ReturnType<typeof setTimeout> | undefined;
		let cancelled = false;

		const step = (next: number) => {
			if (cancelled) return;
			setProgress({ text, index: next });
			if (next < graphemes.length) {
				timer = setTimeout(() => step(next + 1), stepDelay);
			}
		};

		timer = setTimeout(() => step(1), delay);

		return () => {
			cancelled = true;
			if (timer !== undefined) clearTimeout(timer);
		};
	}, [delay, enabled, graphemes, instant, speed, text]);

	return { typed, rest, done };
}

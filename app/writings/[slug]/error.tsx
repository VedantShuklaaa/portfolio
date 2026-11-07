"use client";

export default function ArticleError({
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<main className="mx-auto w-full max-w-[640px] px-5 py-16 sm:py-24">
			<p className="text-sm text-muted-foreground">500</p>
			<h1 className="mt-2 text-2xl sm:text-3xl">This article could not load</h1>
			<p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
				Something went wrong while fetching it. Please try again.
			</p>
			<button
				type="button"
				onClick={reset}
				className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
			>
				Try again
			</button>
		</main>
	);
}

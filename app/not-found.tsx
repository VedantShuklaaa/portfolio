import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Page not found",
	robots: { index: false, follow: true },
};

export default function NotFound() {
	return (
		<main className="flex min-h-svh w-full items-center justify-center px-5">
			<div className="mx-auto w-full max-w-[640px] text-center">
				<p className="text-sm text-muted-foreground">404</p>

				<h1 className="mt-2 text-3xl sm:text-4xl">Page not found</h1>

				<p className="mx-auto mt-3 max-w-[44ch] text-muted-foreground">
					The page you&apos;re looking for doesn&apos;t exist or has moved. Head back home or
					read something I&apos;ve written.
				</p>

				<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
					<Link
						href="/"
						className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
					>
						Go home
					</Link>
					<Link
						href="/writings"
						className="rounded-lg bg-muted px-4 py-2 text-sm text-foreground outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
					>
						Read writings
					</Link>
				</div>
			</div>
		</main>
	);
}
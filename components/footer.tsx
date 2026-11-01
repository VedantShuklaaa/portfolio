import Link from "next/link";

const NAME = "vedantshukla.in"; // set your full name
const LINKS = [
	{ label: "Home", href: "/" },
	{ label: "Writings", href: "/writings" },
	{ label: "projects", href: "https://projects.vedantshukla.in" },
	{ label: "contact", href: "/contact" },
];

export function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="mx-auto w-full max-w-full px-5 pb-10 pt-16">
			<div className="flex flex-col gap-4 border-t pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
				<p>
					© {year} {NAME}
				</p>

				<nav aria-label="Footer">
					<ul className="flex items-center gap-4">
						{LINKS.map(({ label, href }) => (
							<li key={href}>
								<Link
									href={href}
									className="rounded-sm outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
								>
									{label}
								</Link>
							</li>
						))}
					</ul>
				</nav>
			</div>
		</footer>
	);
}
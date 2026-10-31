export type NavItem = {
	label: string;
	href: string;
	external?: boolean;
	newTab?: boolean;
	mono?: boolean;
};

const resumeUrl = process.env.NEXT_PUBLIC_RESUME_URL;

export const navItems: NavItem[] = [
	{ label: "Home", href: "/" },
	{ label: "Writings", href: "/writings" },
	{ label: "Projects", href: "https://projects.vedantshukla.in", external: true },
	{ label: "Contact", href: "/contact" },
	...(resumeUrl
		? [{ label: "Resume", href: resumeUrl, external: true, newTab: true, mono: true }]
		: []),
];
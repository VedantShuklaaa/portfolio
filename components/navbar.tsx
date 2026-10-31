"use client";

import { usePathname } from "next/navigation";

import { NavLink } from "@/components/nav-link";
import { navItems, type NavItem } from "@/lib/nav";

function isActive(item: NavItem, pathname: string) {
	if (item.external) return false;
	if (item.href === "/") return pathname === "/";
	return pathname.startsWith(item.href);
}

export function Navbar() {
	const pathname = usePathname();

	return (
		<div className="pointer-events-none fixed inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-50 flex justify-center px-3">
			<nav
				aria-label="Primary"
				className="pointer-events-auto flex max-w-full items-center gap-0.5 whitespace-nowrap rounded-full border border-foreground/15 bg-background p-1"
			>
				{navItems.map((item) => (
					<NavLink
						key={item.href}
						item={item}
						active={isActive(item, pathname)}
					/>
				))}
			</nav>
		</div>
	);
}
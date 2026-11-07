"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LogoutButton() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	async function signOut() {
		setLoading(true);
		try {
			const supabase = createSupabaseBrowserClient();
			await supabase.auth.signOut();
			router.replace("/admin/login");
			router.refresh();
		} catch {
			setLoading(false);
		}
	}

	return (
		<button
			type="button"
			onClick={() => void signOut()}
			disabled={loading}
			className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-60"
		>
			{loading ? "Signing out…" : "Sign out"}
		</button>
	);
}

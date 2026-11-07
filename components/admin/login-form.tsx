"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Field, inputClass } from "@/components/admin/field";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export function LoginForm() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function signIn() {
		if (!isSupabaseConfigured()) {
			setError("Admin sign-in is not configured.");
			return;
		}

		setError(null);
		setLoading(true);

		try {
			const supabase = createSupabaseBrowserClient();
			const { error: signInError } = await supabase.auth.signInWithPassword({
				email: email.trim(),
				password,
			});

			if (signInError) {
				setError("Invalid email or password.");
				return;
			}

			router.replace("/admin");
			router.refresh();
		} catch {
			setError("Could not sign in. Try again.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<form
			className="mt-8 flex max-w-sm flex-col gap-4"
			onSubmit={(event) => {
				event.preventDefault();
				void signIn();
			}}
		>
			<Field label="Email">
				<input
					type="email"
					autoComplete="email"
					value={email}
					onChange={(event) => setEmail(event.target.value)}
					aria-label="Email"
					required
					className={inputClass}
				/>
			</Field>

			<Field label="Password">
				<input
					type="password"
					autoComplete="current-password"
					value={password}
					onChange={(event) => setPassword(event.target.value)}
					aria-label="Password"
					required
					className={inputClass}
				/>
			</Field>

			{error ? (
				<p role="alert" className="font-mono text-xs text-muted-foreground">
					{error}
				</p>
			) : null}

			<button
				type="submit"
				disabled={loading}
				className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
			>
				{loading ? "Signing in…" : "Sign in"}
			</button>
		</form>
	);
}

import { redirect } from "next/navigation";
import { Suspense } from "react";

import { LoginForm } from "@/components/admin/login-form";
import { getAdminContext } from "@/lib/auth/admin";

async function LoginGate() {
	const context = await getAdminContext();
	if (context) redirect("/admin");
	return <LoginForm />;
}

export default function AdminLoginPage() {
	return (
		<main className="mx-auto h-screen flex flex-col justify-center w-full max-w-[740px] px-5 py-16 sm:py-24">
			<h1 className="text-2xl sm:text-3xl">Admin</h1>
			<p className="mt-2 max-w-[48ch] text-muted-foreground">
				Sign in with the administrator account to manage articles.
			</p>
			<Suspense
				fallback={
					<p className="mt-8 font-mono text-xs text-muted-foreground">
						Loading…
					</p>
				}
			>
				<LoginGate />
			</Suspense>
		</main>
	);
}

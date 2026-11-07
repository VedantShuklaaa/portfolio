export function ArticleListSkeleton() {
	return (
		<div
			aria-hidden="true"
			className="grid gap-2 sm:grid-cols-2 sm:gap-4"
		>
			{Array.from({ length: 4 }, (_, index) => (
				<div
					key={index}
					className="aspect-[3/2] rounded-xl border bg-muted sm:aspect-[3/3.5]"
				/>
			))}
		</div>
	);
}

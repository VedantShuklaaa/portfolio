"use client";

export default function Projects() {
	return(
		<div className="h-screen w-full z-100 bg-transparent flex flex-col items-center justify-center gap-2 font-mono">
			<span className="w-full flex px-25">
				<h1 className="text-9xl font-bold">
					PROJECTS
				</h1>
			</span>
			<div className="h-[60vh] w-[90vw] border bg-card rounded-xl p-4 grid grid-cols-4 gap-2">
				<div className="h-full w-full border bg-card-foreground rounded-md hover:scale-102 transition-scale duration-300 cursor-pointer"></div>
				<div className="h-full w-full border bg-card-foreground rounded-md hover:scale-102 transition-scale duration-300 cursor-pointer"></div>
				<div className="h-full w-full border bg-card-foreground rounded-md hover:scale-102 transition-scale duration-300 cursor-pointer"></div>
				<div className="h-full w-full border bg-card-foreground rounded-md hover:scale-102 transition-scale duration-300 cursor-pointer"></div>
			</div>
		</div>
	)
}
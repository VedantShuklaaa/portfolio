import { Fragment } from "react";

import { TerminalPrompt } from "@/components/terminal-prompt";
import { nowItems } from "@/lib/now";

export function NowTerminal() {
	return (
		<section className="flex flex-col gap-3">
			<h2 className="sr-only">Now</h2>
			<TerminalPrompt command="cat now.txt" />
			<dl className="grid grid-cols-[5rem_minmax(0,1fr)] gap-x-4 gap-y-1">
				{nowItems.map((item) => (
					<Fragment key={item.label}>
						<dt className="font-mono text-xs text-muted-foreground">
							{item.label}
						</dt>
						<dd className="font-mono text-xs text-foreground">
							{item.value}
						</dd>
					</Fragment>
				))}
			</dl>
		</section>
	);
}

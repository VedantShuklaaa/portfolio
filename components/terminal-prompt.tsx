type TerminalPromptProps = {
	command: string;
};

export function TerminalPrompt({ command }: TerminalPromptProps) {
	return (
		<p aria-hidden="true" className="font-mono text-sm">
			<span className="text-muted-foreground">$</span>{" "}
			<span className="text-foreground">{command}</span>
		</p>
	);
}

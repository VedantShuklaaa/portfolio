import styles from "./terminal-cursor.module.css";

// The Turbopack CSS rule loads every .css file as plain CSS, so module exports
// can be empty and the stylesheet emits a global `.cursor` class instead.
const cursorClass = styles.cursor || "cursor";

export function TerminalCursor() {
	return (
		<p aria-hidden="true" className="font-mono text-xs">
			<span className="text-muted-foreground">$</span>{" "}
			<span className={cursorClass} />
		</p>
	);
}

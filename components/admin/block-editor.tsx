"use client";

import { useState } from "react";

import { BlockFields } from "@/components/admin/block-fields";
import { inputClass } from "@/components/admin/field";
import type { EditorBlock } from "@/components/admin/types";
import {
	BLOCK_LABELS,
	BLOCK_TYPES,
	createEmptyBlock,
	type BlockType,
} from "@/lib/articles/blocks";

const smallButtonClass =
	"rounded-lg border border-border px-2 py-1 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40";

export function BlockEditor({
	blocks,
	onChange,
}: {
	blocks: EditorBlock[];
	onChange: (blocks: EditorBlock[]) => void;
}) {
	const [newType, setNewType] = useState<BlockType>("paragraph");

	function update(index: number, block: EditorBlock["block"]) {
		onChange(
			blocks.map((item, itemIndex) =>
				itemIndex === index ? { ...item, block } : item,
			),
		);
	}

	function move(index: number, offset: -1 | 1) {
		const target = index + offset;
		if (target < 0 || target >= blocks.length) return;
		const next = [...blocks];
		[next[index], next[target]] = [next[target], next[index]];
		onChange(next);
	}

	function remove(index: number) {
		onChange(blocks.filter((_, itemIndex) => itemIndex !== index));
	}

	function add() {
		onChange([
			...blocks,
			{ key: crypto.randomUUID(), block: createEmptyBlock(newType) },
		]);
	}

	return (
		<section className="flex flex-col gap-4">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<h2 className="font-heading text-base font-medium">Content</h2>
				<div className="flex items-center gap-2">
					<select
						value={newType}
						onChange={(event) => setNewType(event.target.value as BlockType)}
						aria-label="Block type"
						className={`${inputClass} w-auto`}
					>
						{BLOCK_TYPES.map((type) => (
							<option key={type} value={type}>
								{BLOCK_LABELS[type]}
							</option>
						))}
					</select>
					<button type="button" onClick={add} className={smallButtonClass}>
						Add block
					</button>
				</div>
			</div>

			{blocks.length === 0 ? (
				<p className="text-sm text-muted-foreground">
					No blocks yet. Add a paragraph to get started.
				</p>
			) : (
				<ol className="flex flex-col gap-4">
					{blocks.map((item, index) => (
						<li
							key={item.key}
							className="rounded-xl border border-border p-4"
						>
							<div className="mb-3 flex flex-wrap items-center justify-between gap-3">
								<p className="font-mono text-xs text-muted-foreground">
									{index + 1} · {BLOCK_LABELS[item.block.type]}
								</p>
								<div className="flex items-center gap-2">
									<button
										type="button"
										onClick={() => move(index, -1)}
										disabled={index === 0}
										aria-label="Move block up"
										className={smallButtonClass}
									>
										↑
									</button>
									<button
										type="button"
										onClick={() => move(index, 1)}
										disabled={index === blocks.length - 1}
										aria-label="Move block down"
										className={smallButtonClass}
									>
										↓
									</button>
									<button
										type="button"
										onClick={() => remove(index)}
										aria-label={`Remove ${BLOCK_LABELS[item.block.type]} block`}
										className={smallButtonClass}
									>
										Remove
									</button>
								</div>
							</div>

							<BlockFields
								block={item.block}
								onChange={(block) => update(index, block)}
							/>
						</li>
					))}
				</ol>
			)}
		</section>
	);
}

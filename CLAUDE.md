# Portfolio: project guide

Personal portfolio for Vedant Shukla (Rust backend developer, Web3 and low-latency systems).

## Architecture

* Two Next.js apps that share one design config (tokens, fonts, components):
  * `vedantshukla.in`: main site (intro, links, experience, writing)
  * `projects.vedantshukla.in`: separate app for projects
* The "Projects" link on the main site is a plain `<a href="https://projects.vedantshukla.in">`, not a Next route.
* Keep `app/globals.css`, the font setup in `app/layout.tsx`, and `components/ui/*` identical in both apps. Never let them drift.

## Stack

Next.js (App Router), TypeScript (strict), Tailwind CSS v4, framer-motion. shadcn/ui is optional and only for primitives.
Package manager: bun. Use `bun` and `bunx`, never npm, yarn, or pnpm.

## Design principles

* Simple, quiet, subtle. Nothing should feel heavy.
* Reference: the projects list on rauno.me. Plain text rows, lots of whitespace, no cards.
* Black and white only. No accent colors, gradients, shadows, glassmorphism, or blur.
* Single left-aligned column, `max-w-[640px]`, generous vertical spacing.

## Colors

* Use semantic tokens only: `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-muted`.
* Never hardcode hex, `zinc-*`, `gray-*`, or any raw color. Never add new tokens without asking.
* Dark mode is class-based (`.dark`). Every component must work in both modes.

## Typography

* Headings: `font-heading` (Inter Tight), `font-medium`, `tracking-tight`.
* Body: `font-sans` (Inter), 15px, `leading-relaxed`.
* Meta (years, tags, labels): `font-mono text-xs text-muted-foreground tabular-nums`.
* Scale: name `text-2xl`, section label `text-sm font-medium`, body `text-[15px]`, meta `text-xs`.
* Two weights only: 400 and 500. Secondary text is `text-muted-foreground`, never opacity.

## Motion (framer-motion)

* Animate only `opacity` and `transform`. Max translate 8px. Duration 0.25 to 0.4s.
* Easing: `[0.22, 1, 0.36, 1]`. No spring bounce, no parallax, no scroll-jacking, no looping animations.
* Entrance: fade up once. Stagger children by 0.04 to 0.06s.
* Navbar: floating bottom pill. The sliding active indicator lives in `components/nav-link.tsx` (`layoutId`). It's the one exception to the 0.25 to 0.4s rule: 0.5s, ease `[0.4, 0, 0.2, 1]`, and the link text color transition (`duration-500`) must match it. Don't add other nav animations.

```tsx
const ease = [0.22, 1, 0.36, 1] as const;

<motion.div
  initial={{ opacity: 0, y: 6 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.35, ease }}
/>
```

* Hover: one pattern only. When the list is hovered, rows that are not hovered drop to `opacity-40` (`group-hover/list:not-hover:opacity-40`, with `transition-opacity`).
* Wrap the app in `<MotionConfig reducedMotion="user">`. Respect `prefers-reduced-motion` everywhere.

## Projects list (rauno-style)

One row per project: title (`font-heading`), one-line description (`text-muted-foreground`), year (mono, right-aligned). No images, no cards, no borders between rows unless asked. Each row links to its detail page.

## Code conventions

* Fully modular: one component per file, small, kebab-case filenames, in `components/`.
* Server components by default. Add `"use client"` only to the smallest component that needs framer-motion or state.
* No `any`. Use the `cn()` helper from `lib/utils.ts` for class merging.
* `next/font` for fonts, `next/image` for images. No font or icon CDN links.
* Keep dependencies minimal. Ask before adding a library.
* Before finishing a task, run lint and the typecheck, and run react-doctor if it's installed. Fix what they report.

## Git and ownership (strict)

* Never run `git commit`, `git push`, or open a PR. Edit files in the working tree only.
* No AI attribution anywhere: no `Co-Authored-By`, no "Generated with" lines, no session links, no tool names in code, comments, commit messages, or PR text. Vedant owns all the code.
* After every change, print: a branch name, a commit message, and a PR description.
* Update `README.md` with every change that affects setup, structure, or behavior.

## Content (confirm details with Vedant before writing copy)

* Home: name, one-line description, links (GitHub, email, resume), link to projects.
* Projects app: lobster (order book), bridge indexer, CDN, perc.
* Optional later: experience, writing.
* Skip skill bars, stock photos, and generic "about me" text.

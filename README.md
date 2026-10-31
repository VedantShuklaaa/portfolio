# vedantshukla.in

Personal portfolio. Simple, monochrome, subtle motion.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · framer-motion

## Getting started

```bash
bun install
bun dev
```

Open http://localhost:3000.

## Structure

```
app/
  globals.css     design tokens (monochrome) and base styles
  layout.tsx      fonts and metadata
components/       one component per file
lib/utils.ts      cn() class helper
```

## Design

* Colors: grayscale tokens in `app/globals.css` (`:root` and `.dark`). Use semantic classes only (`bg-background`, `text-muted-foreground`, and so on).
* Fonts: Inter Tight (headings), Inter (body), Geist Mono (meta), loaded through `next/font`.
* Motion: framer-motion, opacity and small translate only, ease `[0.22, 1, 0.36, 1]`.

## Projects subdomain

Projects live in a separate app at `projects.vedantshukla.in` and share the same tokens, fonts, and UI components. Keep `app/globals.css` and the font setup in sync between both apps.

## CI

* `react-doctor.yml`: scans changed files on every PR and posts a summary comment. Advisory by default.
* `ci.yml`: lint, typecheck and build on every PR and push to `main`.

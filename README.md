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
  globals.css            design tokens (monochrome) and base styles
  layout.tsx             fonts, metadata, page container, navbar
components/
  landing/hero.tsx       home hero: intro copy, links, staggered entrance
  navbar.tsx             floating bottom navbar
  nav-link.tsx           single link with the sliding active pill
  motion-provider.tsx    LazyMotion + reduced-motion config for framer-motion
lib/
  nav.ts                 nav items
  utils.ts               cn() class helper
```

## Home hero

Name, a mono role line, a short intro, and links to GitHub, projects, and (when `NEXT_PUBLIC_RESUME_URL` is set) the resume. The section fills the viewport height, keeps a readable `52ch` measure, and fades up once on load with a 0.05s stagger. Motion only uses opacity and a 6px translate, so `prefers-reduced-motion` leaves a static page.

## Navbar

A floating pill fixed at the bottom of the screen. The active page is an inverted pill that slides between links (framer-motion `layoutId`). Edit links in `lib/nav.ts`.

* Projects links to `https://projects.vedantshukla.in` with a plain anchor.
* Resume is optional. Set `NEXT_PUBLIC_RESUME_URL` in `.env.local` to show it.

## SEO

`app/layout.tsx` sets `metadataBase` to `https://vedantshukla.in`. `app/page.tsx` adds the absolute home title, description, canonical URL, OpenGraph/Twitter cards, and `Person` JSON-LD. Update the canonical domain there if the site moves.

## Design

* Colors: grayscale tokens in `app/globals.css` (`:root` and `.dark`). Use semantic classes only (`bg-background`, `text-muted-foreground`, and so on).
* Fonts: Inter Tight (headings), Inter (body), Geist Mono (meta), loaded through `next/font`.
* Motion: framer-motion, opacity and small translate only, ease `[0.22, 1, 0.36, 1]`. The navbar pill is slower (0.5s, ease `[0.4, 0, 0.2, 1]`) and its text color transition matches.

## Projects subdomain

Projects live in a separate app at `projects.vedantshukla.in` and share the same tokens, fonts, and UI components. Keep `app/globals.css` and the font setup in sync between both apps.

## CI

* `react-doctor.yml`: scans changed files on every PR and posts a summary comment. Advisory by default.
* `ci.yml`: lint, typecheck and build on every PR and push to `main`.

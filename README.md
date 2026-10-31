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
  landing-body.tsx       terminal-style blocks below the hero
  projects-terminal.tsx  $ ls ~/projects list
  now-terminal.tsx       $ cat now.txt block
  terminal-prompt.tsx    mono "$ command" line
  terminal-cursor.tsx    blinking cursor line
  terminal-cursor.module.css  cursor blink keyframes
  reveal.tsx             client wrapper: fade in once on scroll
  navbar.tsx             floating bottom navbar
  nav-link.tsx           single link with the sliding active pill
  motion-provider.tsx    LazyMotion + reduced-motion config for framer-motion
lib/
  projects.ts            project list and PROJECTS_URL
  now.ts                 now block items
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

## Landing body

Below the hero, the landing page renders terminal-style blocks (`components/landing-body.tsx`): a projects list (`$ ls ~/projects`), a now block (`$ cat now.txt`), and a blinking cursor line.

- Edit projects in `lib/projects.ts` and the now block in `lib/now.ts`.
- Rows link to the projects subdomain (`PROJECTS_URL`). Hovering a row dims the others.
- Blocks fade in once on scroll through `components/reveal.tsx`. Everything else is a server component.

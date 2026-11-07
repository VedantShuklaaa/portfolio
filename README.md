# vedantshukla.in

Personal portfolio. Simple, monochrome, subtle motion.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · framer-motion · Supabase (Postgres, Auth, Storage) · Zod

## Getting started

```bash
bun install
bun dev
```

Open http://localhost:3000.

`.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://vedantshukla.in
NEXT_PUBLIC_RESUME_URL=          # optional, hides the resume link when empty
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable or anon key>
ADMIN_USER_IDS=<auth-user-uuid>[,<auth-user-uuid>]
```

`ADMIN_USER_IDS` is server-only and is the allowlist for the admin API and UI. The public Supabase keys are safe to ship, provided RLS is enabled (the migration does this). No service-role key is used anywhere.

## Structure

```
app/
  globals.css            design tokens (monochrome) and base styles
  layout.tsx             fonts, metadata, page container, navbar
  robots.ts              crawler rules and sitemap location
  sitemap.ts             public routes and published articles
  opengraph-image.tsx    generated default social card
  feed.xml/route.ts      RSS feed for published writings
  writings/page.tsx      published article index
  writings/[slug]/       article page, error boundary, per-article OG image
  admin/                 Supabase Auth login and private article dashboard
  api/admin/             protected article CRUD and media upload routes
components/
  admin/                 editor, media picker, login/logout, delete controls
  articles/              ArticleRenderer and one component per block type
  landing/hero.tsx       home hero: intro copy, links, staggered entrance
  landing-body.tsx       terminal-style blocks below the hero
  projects-terminal.tsx  $ ls ~/projects list
  now-terminal.tsx       $ cat now.txt block
  terminal-prompt.tsx    mono "$ command" line
  terminal-cursor.tsx    blinking cursor line
  terminal-cursor.module.css  cursor blink keyframes
  typewriter.tsx         typewriter effect for plain text
  typewriter.module.css  typewriter cursor blink keyframes
  reveal.tsx             client wrapper: fade in once on scroll
  navbar.tsx             floating bottom navbar
  nav-link.tsx           single link with the sliding active pill
  motion-provider.tsx    LazyMotion + reduced-motion config for framer-motion
lib/
  site.ts                canonical URL, metadata defaults, socials, projects URL
  seo.ts                 JSON-LD serializer (escapes "<")
  articles/schema.ts     Zod schemas for articles, blocks, media and embeds
  articles/repository.ts Supabase queries (public reads and admin writes)
  articles/client.ts     browser-side save/delete requests for the editor
  api/http.ts            JSON errors, same-origin check, body size limit
  auth/admin.ts          Supabase user verification plus the admin allowlist
  supabase/              browser, server and public Supabase clients
  upload.ts              upload validation (MIME, magic bytes, SVG checks)
  rate-limit.ts          durable Postgres-backed rate limiting
  dates.ts               article date formatting
  projects.ts            project list
  now.ts                 now block items
  nav.ts                 nav items
  utils.ts               cn() class helper
  use-typewriter.ts      grapheme-based typing hook
public/
  llms.txt               short factual summary for AI answer engines
supabase/
  migrations/            articles schema, RLS, storage bucket, rate limits
proxy.ts                 Auth cookie refresh and a 404 check for article slugs
```

## Home hero

Name, a mono role line, a short intro, and links to GitHub, projects, and (when `NEXT_PUBLIC_RESUME_URL` is set) the resume. The section fills the viewport height, keeps a readable `52ch` measure, and fades up once on load with a 0.05s stagger. Motion only uses opacity and a 6px translate, so `prefers-reduced-motion` leaves a static page.

## Navbar

A floating pill fixed at the bottom of the screen. The active page is an inverted pill that slides between links (framer-motion `layoutId`). Edit links in `lib/nav.ts`.

* Projects links to `https://projects.vedantshukla.in` with a plain anchor.
* Resume is optional. Set `NEXT_PUBLIC_RESUME_URL` in `.env.local` to show it.

## SEO and discovery

* `lib/site.ts` is the single source of truth for the canonical origin, default title, description, social profiles, and the projects URL. `NEXT_PUBLIC_SITE_URL` overrides the origin (default `https://vedantshukla.in`).
* `app/layout.tsx` sets `metadataBase`, the `%s | Vedant Shukla` title template, OpenGraph/Twitter defaults, the RSS alternate, and `viewport`/`themeColor`. Every page sets its own title, description, and `alternates.canonical`.
* `app/robots.ts` allows public routes and explicitly allows GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, and CCBot.
* `app/sitemap.ts` covers the home page, `/writings`, and every published article, using `published_at` for `lastModified`.
* `app/feed.xml/route.ts` serves RSS at `/feed.xml`; `public/llms.txt` is the short AI-facing summary.
* JSON-LD: home has Person + WebSite; `/writings` has Blog; each article has BlogPosting + BreadcrumbList. All JSON is serialized through `lib/seo.ts`, which escapes `<`.
* Article pages are rendered from Supabase content, metadata and per-article OG image. Missing or unpublished slugs return a real 404.

## Writings CMS

Published articles live in Supabase. Content is a JSONB array of typed blocks; the title stays a metadata column and is not part of the block array.

### One-time setup

1. Apply `supabase/migrations/20261107000000_writings_cms.sql` (Supabase CLI `supabase db push`, or paste it into the SQL editor). It creates `articles`, `admins`, `api_rate_limits`, the `article-media` bucket, RLS policies and `consume_rate_limit()`.
2. Create the admin user in Supabase Auth (email/password).
3. Copy that user's UUID into `public.admins` and into `ADMIN_USER_IDS`:

   ```sql
   insert into public.admins (user_id) values ('<auth-user-uuid>');
   ```

   The two checks are layered: the app verifies the allowlist on every request, and RLS verifies `is_admin()` in the database.
4. Add the Supabase URL and publishable key to the deployment environment.

### Admin

Visit `/admin/login`, sign in, then create or edit articles at `/admin/articles/new` and `/admin/articles/[id]`. Drafts are invisible to the public list, article pages, sitemap and RSS. Slugs are auto-generated, validated (`lowercase-with-hyphens`) and unique; conflicts return a 409. Publishing sets `published_at` server-side; clients cannot set status or timestamps directly.

### Blocks

`cover`, `heading` (H2–H4), `paragraph`, `image`, `video`, `svg`, `code`, `quote`, `list`, `callout`, `embed` (YouTube/Vimeo) and `divider`. The renderer parses stored content with Zod, keeps valid blocks in array order and shows a muted notice for blocks that fail validation. Unknown block types are skipped rather than breaking the page.

### API

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/admin/articles` | Create an article |
| `PATCH` | `/api/admin/articles/[id]` | Update an article |
| `DELETE` | `/api/admin/articles/[id]` | Delete an article |
| `POST` | `/api/admin/upload` | Upload media to Supabase Storage |

Every route verifies the Supabase session, the `ADMIN_USER_IDS` allowlist and the request `Origin`, validates input with Zod, and rate-limits per user through `consume_rate_limit()`. Errors are returned as short JSON messages without internal details.

### Media and security

* Uploads accept PNG/JPEG/WebP/GIF (10 MB), SVG (512 KB) and MP4/WebM (50 MB). Type, extension, magic bytes and size are checked. SVGs containing scripts, event handlers, external references or entities are rejected, and SVGs render through `<img>` so they cannot execute scripts.
* Storage paths are generated server-side (`year/month/uuid.ext`) and stored as URLs/metadata in JSONB. Binaries never touch Postgres.
* Media URLs must be site-relative or point at the project's public `article-media` bucket, which prevents SSRF through article content.
* RLS allows anonymous reads of published rows only; writes require a row in `public.admins`. The migration never disables RLS.
* `next.config.ts` extends CSP (`img-src`, `media-src`, `connect-src`, `frame-src`) and `images.remotePatterns` for Supabase and the two embed providers.
* `/admin` is marked `noindex` and is excluded from the sitemap.
* Security headers (CSP, HSTS, nosniff, referrer, permissions, COOP, XFO) are defined in `next.config.ts`.

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

## Typewriter

`components/typewriter.tsx` types out any plain text, one character at a time.

```tsx
<Typewriter text="Rust · Web3 · low-latency systems" />

<Typewriter
  as="p"
  text="Building fast, reliable systems."
  speed={30}
  delay={300}
  cursor="blink"
  className="font-mono text-xs text-muted-foreground"
/>
```

- Props: `text`, `as`, `className`, `speed` (ms per character), `delay` (ms), `startOnView`, `cursor` (`typing`, `blink` or `none`).
- The full text is in the DOM from the first render (screen readers and search engines read it), and the layout never shifts while typing.
- With reduced motion enabled, the full text shows immediately.
- It is a client leaf component. Pass plain strings only. Avoid using it on the main heading, since typing delays the largest paint.


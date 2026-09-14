# matuz.dev — Project Guide

> A personal website, portfolio, playground, and eventually a small corner of the internet that is entirely mine.

This file is a **self-orientation guide** for building `matuz.dev`. It is intentionally not a rigid specification. The site should be able to evolve as ideas change.

---

## 1. Vision

`matuz.dev` should be more than a résumé.

The main site should present me as a **full-stack developer**, showcase my projects and skills, provide social/contact links, and eventually host a collection of casual public notes.

At the same time, the domain should be flexible enough to contain experiments and fun projects:

- `matuz.dev/`
- `matuz.dev/about`
- `matuz.dev/projects`
- `matuz.dev/contact`
- `matuz.dev/notes`
- `matuz.dev/lol`
- `matuz.dev/lab`
- `matuz.dev/experiments`
- Anything else that makes sense later

The professional areas should remain polished and reliable. The experimental areas can be weird, playful, or technically unnecessary.

**Core idea:** a polished developer portfolio with a personal playground attached to it.

---

## 2. Tech Stack

### Frontend

- React 19 + TypeScript
- Vite
- Tailwind CSS v4 (CSS-first `@theme` config)
- Motion (`motion/react`)
- Lucide React
- React Router

### Testing

- Vitest + jsdom
- Testing Library (`@testing-library/react`, `user-event`, `jest-dom`)
- Colocated tests, folder-per-component structure

### Content

- Notes are Markdown, fetched at runtime from a private Obsidian repository (see §7)
- `react-markdown` / `remark` / `rehype` when the notes system is built
- MDX only if interactive content becomes genuinely useful

### Deployment

- Heroku, deployed from GitHub

### Not planned initially

Avoid adding infrastructure just for the sake of showing infrastructure.

No initial need for:

- Redux / Zustand
- Express / Fastify
- Prisma / PostgreSQL
- Authentication
- CMS
- GraphQL
- Docker Compose
- HTMX alongside React
- Next.js purely because it is popular

If a real requirement appears later, add the technology then.

---

## 3. Projects

Projects should be represented as data rather than hard-coded directly into page JSX.

Example concept:

```ts
{
  title: '...',
  description: '...',
  technologies: [...],
  github: '...',
  demo: '...',
  image: '...',
}
```

This makes it easy to add, remove, reorder, or redesign projects later.

Project cards should be visually polished and interactive without becoming distracting.

Possible interactions:

- hover effects
- subtle movement
- image transitions
- technology badges
- GitHub/demo links
- expandable details
- page transitions

---

## 4. About

The About page should explain who I am as a developer and what I like building.

Potential topics:

- Full-stack development
- Technologies I enjoy
- Engineering interests
- Current projects
- Things I'm learning
- Personal interests where appropriate

Keep it human rather than turning it into a second résumé.

---

## 5. Contact / Socials

Include relevant ways to find/contact me.

- GitHub
- Discord
- LinkedIn
- Email (mail@matuz.me — wired up)
- Other social platforms if useful

The contact page should remain simple and reliable.

A real contact form can be added later if there is a reason to have one.

---

## 6. Technology / Toolkit Section

The site should show the technologies I work with, but avoid making it look like a giant wall of logos.

Possible categories:

### Languages

- TypeScript
- JavaScript
- SQL

### Frontend

- React
- Next.js
- Tailwind CSS
- MUI

### Backend / Data

- Node.js
- PostgreSQL
- Prisma
- Supabase

### Tools / Environment

- Git
- Docker
- Linux
- NixOS

The exact list can change.

### Visual idea

Technology icons can be interactive.

For example, hovering a technology could reveal:

```text
TypeScript

My primary language for
application development.
```

Primary technologies can receive more visual emphasis than technologies I only occasionally use.

---

## 7. Notes System

The notes section is **not intended to be a traditional blog**.

It should be a place for casual public writing:

- things I learned
- recommendations
- random thoughts
- technical notes
- opinions
- things I like
- tutorials or explanations
- media recommendations
- general yapping

### Architecture: Obsidian repository as the source of truth

Notes are written in **Obsidian** and pushed to a **private GitHub repository**. The website does **not** store note content — it fetches Markdown from a specific tracked folder in that repo and renders it.

```text
Obsidian vault (private GitHub repo)
        ↓  fetch with a fine-grained personal access token
GitHub Contents API (raw markdown from the tracked folder)
        ↓  our endpoint holds the token
Markdown parser (react-markdown + remark/rehype)
        ↓
React-rendered note pages
```

### How it works

1. **Private repo, public site.** The notes repo stays private. The site fetches only a specific tracked folder (e.g. `notes/public/`), so the rest of the vault is never exposed.
2. **Token handling.** A GitHub fine-grained PAT scoped to *only* the notes repo with *contents: read*. It lives server-side (Heroku config var / serverless env). **The token is never embedded in the frontend bundle or the public site repository.** Frontend requests go through our own endpoint, which attaches the token.
3. **Fetching.** The endpoint lists the tracked folder via the GitHub Contents API, returns note metadata (name, last-updated), and serves individual files as raw Markdown.
4. **Rendering.** The site parses the Markdown and renders it with a polished reading experience — typography consistent with the site's editorial style, syntax-highlighted code blocks, images and links resolved against the notes repo, YouTube embeds where wanted.
5. **Caching.** GitHub API rate limits make caching mandatory: cache responses server-side (interval revalidation or ETags/webhooks on push) so reader traffic never burns through the token's rate limit.

### Why this design

- Writing stays where I already write (Obsidian) — zero extra tooling.
- The vault never becomes public; only the curated folder is served.
- The website repository stays clean of content.
- Adding a note is a git push to the vault; the site picks it up on the next cache refresh — no deploy needed.

### Markdown → MDX later

Start with ordinary Markdown. If notes eventually need interactive components, custom embeds, or code playgrounds, consider MDX then — do not introduce it just because it is technically cool.

---

## 8. Visual Direction

The site should be:

- Modern
- Polished
- Dark-oriented
- Clean
- Reliable
- Slightly futuristic
- Interactive
- Not extravagant

A background image is part of the visual identity — currently `src/assets/hero-background.webp`, to be replaced with a generated abstract piece later.

### Background principles

- abstract rather than literal
- dark enough for readable text
- visually interesting at large resolutions
- subtle enough for UI elements to remain dominant
- preferably with areas of lower visual complexity behind text
- avoid excessive "AI art" appearance

Think of the background as atmosphere, not the centerpiece. Full palette and typography live in `src/DESIGN.md`.

---

## 9. Architecture Philosophy

Keep the project easy to change.

Current structure:

```text
matuz.dev/
├── src/
│   ├── components/        # folder-per-component, default exports via index.ts
│   │   ├── layout/
│   │   ├── ui/
│   │   └── content/
│   ├── pages/             # route-level pages (HomePage)
│   ├── content/           # bilingual locale dictionaries (pt-BR default, en)
│   ├── data/              # projects.ts, technologies.ts (pending)
│   ├── lib/               # motion presets, shared utilities
│   ├── test/              # Vitest setup
│   ├── App.tsx            # router shell
│   └── main.tsx
├── public/
├── guide.md               # this file
└── vite.config.ts
```

Key conventions:

- `$/*` path alias points at `src/*`
- Components: default exports through folder barrels, colocated tests
- Text content lives in locale JSON files, never hard-coded in components
- Animation presets centralized in `src/lib/motion.ts`

Prefer simple, obvious architecture over abstractions created before they are needed.

---

## 10. GitHub

The source code should be public.

The repository itself should therefore also be treated as a portfolio piece.

Things worth demonstrating naturally through the project:

- TypeScript
- React component architecture
- clean Git history
- reusable components
- responsive design
- accessibility
- testing where useful
- CI/CD
- deployment
- documentation
- sensible dependency choices

Do not artificially add complexity just to make the repository look impressive.

---

## 11. Deployment

Initial deployment target: **Heroku**.

Possible flow:

```text
Local development
      ↓
GitHub
      ↓
Heroku
      ↓
matuz.dev
```

CI gate before deploy: `bun run lint && bun run test && bun run build`.

Secrets (including the notes-repo token, §7) live in Heroku config vars — never in the repository.

Heroku is acceptable even though other static hosting platforms may be simpler. If it becomes inconvenient later, deployment can be reconsidered without changing the frontend architecture.

---

## 12. Potential Future Features

Ideas, not requirements:

- GitHub API integration
- dynamically displaying repositories
- project statistics
- contact form
- guestbook
- interactive playground
- WebGL visual
- custom `/lol` page
- mini games
- developer tools
- interactive experiments
- RSS feed for notes
- search for notes
- tags/categories for notes
- syntax-highlighted code blocks
- YouTube embeds
- image galleries
- custom Markdown components

Only build these when they actually become interesting.

---

## 13. Development Phases

### Phase 1 — Foundation

- [x] Initialize React + TypeScript + Vite
- [x] Configure Tailwind
- [x] Configure routing
- [x] Establish typography
- [x] Establish color palette
- [x] Establish spacing/layout system
- [x] Create reusable buttons/components
- [x] Add background image
- [x] Build responsive shell/navigation
- [x] Set up testing (Vitest + Testing Library, 100+ tests)

### Phase 2 — Main Pages

- [x] Home
- [x] Footer
- [ ] About
- [ ] Projects
- [ ] Contact
- [ ] Social links

### Phase 3 — Visual Polish

- [x] Hero animations
- [x] Scroll-triggered section reveals
- [x] Language-switch transition
- [ ] Page transitions
- [ ] Project-card interactions
- [ ] Technology icon interactions
- [ ] Responsive/mobile polish
- [ ] Accessibility pass (incl. prefers-reduced-motion)
- [ ] Performance pass

### Phase 4 — Notes

- [ ] Create private Obsidian notes repository with a tracked public folder
- [ ] Generate fine-grained PAT (contents: read, single repo)
- [ ] Build fetch endpoint (server holds the token, frontend never does)
- [ ] Implement caching / rate-limit strategy
- [ ] Render Markdown with site-consistent typography
- [ ] Add images, links, YouTube embeds
- [ ] Create notes index and individual note pages

### Phase 5 — Deployment

- [x] GitHub Actions CI (lint + test + build on push/PR)
- [ ] Connect GitHub
- [ ] Configure Heroku (incl. config vars / secrets)
- [ ] Configure domain
- [ ] Test production build
- [ ] Test mobile
- [ ] Test accessibility
- [ ] Deploy

### Phase 6 — Playground

- [ ] `/lol`
- [ ] `/lab`
- [ ] `/experiments`
- [ ] Other weird/fun ideas

---

## 14. Design Rule

When deciding whether to add something, ask:

1. Does it improve the experience?
2. Does it make the site more memorable?
3. Does it demonstrate a useful skill naturally?
4. Does it remain fast and reliable?
5. Is it actually fun to build?

If the answer is mostly "no", don't add it.

---

## 15. Current Direction

### Identity

**Matuz — Full-stack developer**

### Website

**matuz.dev**

### Personality

Professional core + personal playground.

### Visual

Modern + polished + dark + abstract + subtly futuristic.

### Interaction

Animated and responsive, but restrained.

### Content

Projects + About + Contact + casual Markdown notes (fetched from a private Obsidian repo).

### Main stack

**React 19 + TypeScript + Vite + Tailwind v4 + Motion + React Router**

### Deployment

**Heroku**

### Philosophy

> Build something useful, make it look damn good, and leave room to have fun with it.

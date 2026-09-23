# Development notes

Internal orientation for working on this codebase. The public overview lives in the root [`README.md`](../README.md); the long-term vision and roadmap live in [`guide.md`](guide.md).

## Commands

- `bun run dev` — start the local Vite server.
- `bun run build` — type-check and make a production build.
- `bun run lint` — run ESLint.
- `bun run preview` — preview the production build.
- `bun run test` — run the test suite once (Vitest).
- `bun run test:watch` — run tests in watch mode.
- `bun run test:coverage` — run tests with a coverage report (`coverage/index.html`).

## Git hooks & CI

- **Local hooks** (devenv-managed, active inside the devenv shell): ESLint runs on every `git commit`; the full Vitest suite runs on every `git push`.
- **Remote CI** (`.github/workflows/ci.yml`): on every push to `master` and every PR, GitHub Actions runs `lint → test → build` with Bun on Ubuntu. All three must pass.

## Project map

- `src/main.tsx` — entry point, mounts `App`.
- `src/App.tsx` — router shell (`react-router`); maps paths to pages and wraps them in `AnimatePresence` for page transitions (`mode="wait"`). Routes: `/`, `/about`, `/projects`, `/projects/:id`, `/contact`, `/notes`, `/notes/*` (splat → NotePage).
- `src/pages/` — route-level pages, **named** exports via barrel (`export { HomePage }`). Each page composes `PageShell` for the shared chrome and carries its colocated test.
    - `HomePage` (`/`)
    - `AboutPage` (`/about`)
    - `ProjectsPage` (`/projects`)
    - `ProjectDemoPage` (`/projects/:id`)
    - `ContactPage` (`/contact`)
    - `NotesPage` (`/notes`)
    - `NotePage` (`/notes/*`)
- `src/components/` — folder-per-component (see below), colocated tests, barrel re-exports.
    - `layout/` — **default** exports: `Container`, `Section` (`band`/`band="soft"`), `SectionHeading` (stacked/split), `Header` (fixed, hides on scroll-down, `routeLinks` array), `Footer`, `PageBackground`, `PageShell`. Import as `import Button from '$/components/ui/Button'` — the barrel resolves the folder.
    - `ui/` — **default** exports: `Button` (href→anchor, to→Link), `Eyebrow`, `ArrowLink`, `LanguageMenu`, `NavMenu` (mobile drawer, portal, own `routeLinks`), `BrandIcon` + `brandGlyphs.ts` (github/linkedin/rss/discord inline SVGs), `SafeLink` (scrape-resistant link), `Badge`, `Card`, `Divider`, `IconButton`.
    - `content/` — **default** exports: `ProjectCard` (title links to source, tags bottom-anchored, About + Demo actions), `SocialLink`, `TechBadge`.
    - `notes/` — **default** exports: `NoteMarkdown` (+ `callouts.tsx`), `NoteSidebar`, `RelativeTimeTag`, `CopySourceButton`.
- `src/content/` — `eng.json` / `pt-br.json` locale dictionaries; `index.ts` exposes `locales` + `Language`. `content.test.ts` enforces recursive shape parity, real email, stable card/channel ids, owner name untranslated.
- `src/lib/` — `language.ts` (external store, `useSyncExternalStore`, `useLocale`/`setLanguage`, localStorage `matuz.dev:language`), `motion.ts` (EASE, fadeUp, fade, staggerContainer, viewportOnce, pageVariants; default duration 1s), `notes.ts` (client fetch + session cache), `relative-time.ts`, `hash-scroller.tsx`.
- `src/assets/` — `hero-background.webp`, `project-matuz-dev.webp`, `project-wallpaper-picker.webp` (imported in ProjectsPage, mapped by card id via `cardImages` Record — NOT in JSON).
- `server/` — `index.ts` (Express 5: static dist/, `/api/notes`, `/api/notes/*splat`, SPA fallback), `notes.ts` (GitHub Contents API, ETag revalidation, INDEX_TTL 5min, shortId = sha256(path)[0:8]), `notes-meta.ts` (header parsing: fenced ``` created/updated block, YAML frontmatter, or loose lines; TIMESTAMP `YYYY-MM-DDTHH:mm`). Env: `NOTES_GITHUB_TOKEN`, `NOTES_REPO`, `NOTES_PATH` (default `blog`). `notes-meta.test.ts` covers the parser.
- `src/test/setup.ts` — Vitest setup (jest-dom matchers, cleanup, pins language to pt-BR).

## Key mechanisms

### SafeLink (anti-scraping)

`src/components/ui/SafeLink` — renders `<a>` **without href** in static HTML; injects href on pointerenter/pointerdown/touchstart/focus. Keyboard: Enter/Space triggers reveal + rAF click. Before reveal: `role="link"` + `tabindex=0`; after reveal they're dropped (native anchor semantics). Used for: ContactPage channels + closing CTA, HomePage correspondence links, Header social icons, NavMenu drawer social links. Rationale: crawlers parsing raw HTML never harvest `mail@matuz.me` / profile URLs; real visitors lose nothing.

### Copy source (notes)

`src/components/notes/CopySourceButton` — button in NotePage header; copies the note's entire raw `.md` source (as stored in the vault, header stripped) via `navigator.clipboard.writeText`, fallback to hidden-textarea `execCommand('copy')`. States: idle/copied/failed, 2s reset. Locale keys: `notes.copySource` / `copied` / `copyFailed`.

## Conventions

- Pages compose the component kit; avoid hand-rolling containers, sections, or buttons inline.
- **Pages use named exports** through their folder's `index.ts`; **components use default exports** through their folder's `index.ts`. Named type exports (`ButtonProps`, `EyebrowColor`) come from the same barrel.
- **Tests are colocated** with their subject (`Button/Button.test.tsx`), not in a separate tree.
- Text content lives in the locale JSON files — never hard-code user-facing strings in components.
- Animations: import presets from `src/lib/motion.ts`; don't define one-off easings inline.
- Language state comes from `$/lib/language` (`useLocale` in components, `setLanguage` in `PageShell`) — never keep a second copy in page state.
- Never commit personal documents: the CV (`EngSoftware.pdf` at the repo root) is git-ignored and must stay that way; the About page copy is derived from it but lives only in the locale JSONs.
- Quotes are single in TS/TSX (enforced by ESLint); indentation is 4 spaces.
- Path alias `$/*` → `./src/*` (TS 6 removed baseUrl; paths must be relative).
- Tailwind v4: `@theme`/`@utility` flagged by VS Code CSS validator — false positives. `group-hover:` only styles descendants; use plain `hover:` for the element itself.
- Brand icons: never add a package; use local `BrandIcon`/`brandGlyphs.ts`. Discord glyph from simple-icons v13 (viewBox 0 0 24 24); others Bootstrap Icons (0 0 16 16).
- flag-icons: import individual SVGs, not the full CSS.
- react-refresh: never export non-components from `.tsx` component files.
- Commits: conventional prefixes (feat/fix/chore/docs/test), scope allowed, comma-joined for mixed. Atomic commits; when two features share a locale JSON, stage intermediate states.

For CI, gate on: `bun run lint && bun run test && bun run build`.

See [`DESIGN.md`](DESIGN.md) for the palette and design rules, and [`guide.md`](guide.md) for the project vision and roadmap.

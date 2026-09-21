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
- `src/App.tsx` — router shell (`react-router`); maps paths to pages and wraps them in `AnimatePresence` for page transitions (`mode="wait"`).
- `src/pages/` — route-level pages. `HomePage` (`/`), `AboutPage` (`/about`), and `ProjectsPage` (`/projects`); each page composes `PageShell` for the shared chrome and carries its colocated test.
- `src/components/` — folder-per-component (see `src/components/README.md`):
    - `layout/` — `Container`, `Section`, `SectionHeading`, `Header`, `Footer`, `PageBackground`, `PageShell`
    - `ui/` — `Button`, `Eyebrow`, `ArrowLink`, `LanguageMenu`, `Badge`, `Card`, `Divider`, `IconButton`
    - `content/` — portfolio-specific cards (`ProjectCard`, `SocialLink`, `TechBadge`) awaiting data

    Each component folder holds the component, its colocated test, and an `index.ts` barrel re-exporting the default. Import as `import Button from '$/components/ui/Button'` — the barrel resolves the folder, so no `Button/Button` repetition.

- `src/content/` — bilingual locale dictionaries (`eng.json`, `pt-br.json`), loader (`index.ts`), and structural tests.
- `src/lib/motion.ts` — central Motion presets (easings, variants, viewport config).
- `src/index.css` — Tailwind v4 theme tokens, base styles, global utilities.
- `src/assets/hero-background.webp` — page background image.
- `src/test/setup.ts` — Vitest setup (jest-dom matchers, cleanup).

## Conventions

- Pages compose the component kit; avoid hand-rolling containers, sections, or buttons inline.
- **Components use default exports** through their folder's `index.ts`; named type exports (`ButtonProps`, `EyebrowColor`) come from the same barrel.
- **Tests are colocated** with their subject (`Button/Button.test.tsx`), not in a separate tree.
- Text content lives in the locale JSON files — never hard-code user-facing strings in components.
- Animations: import presets from `src/lib/motion.ts`; don't define one-off easings inline.
- Language state comes from `$/lib/language` (`useLocale` in components, `setLanguage` in `PageShell`) — never keep a second copy in page state.
- Never commit personal documents: the CV (`EngSoftware.pdf` at the repo root) is git-ignored and must stay that way; the About page copy is derived from it but lives only in the locale JSONs.
- Quotes are single in TS/TSX (enforced by ESLint); indentation is 4 spaces.

For CI, gate on: `bun run lint && bun run test && bun run build`.

See [`DESIGN.md`](DESIGN.md) for the palette and design rules, and [`guide.md`](guide.md) for the project vision and roadmap.

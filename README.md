# matuz.dev

The personal website and portfolio of Matuz (Rodrigo dos Santos Lima) — a full-stack developer. A polished, bilingual (pt-BR / English) portfolio with a playground spirit: professional core, personal edges.

> Build something useful, make it look damn good, and leave room to have fun with it.

## What this is

A dark, editorial, quietly animated single-page portfolio built as a long-term home on the web. It presents who I am, what I build, and how I work — and is designed to grow into a small personal universe: projects, notes, and eventually a few experiments and playground pages.

The site is fully bilingual. Brazilian Portuguese is the default language; English is one click away via the built-in language menu, with a smooth transition between the two.

## Highlights

- **Editorial dark design** — display-serif headings, mono micro-labels, thin dividers, and a restrained blue-violet palette over a near-black background.
- **Motion with restraint** — hero entrance, scroll-triggered section reveals, and a language-switch transition, all driven by centralized animation presets. Honors `prefers-reduced-motion`: movement is disabled and only opacity fades remain.
- **Bilingual by design** — every visible string lives in locale dictionaries (`pt-br.json` / `eng.json`), with tests enforcing structural parity between languages.
- **Component kit** — a folder-per-component library (layout primitives, UI building blocks, content cards) with colocated tests and barrel exports.
- **Tested** — 100+ tests with Vitest + Testing Library, colocated with their subjects.
- **CI-gated** — GitHub Actions runs lint, tests, and the production build on every push and PR.

## Tech stack

| Layer | Choice |
| --- | --- |
| UI | React 19 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) |
| Animation | Motion (`motion/react`) |
| Routing | React Router |
| Icons | Lucide React (+ local brand glyphs) |
| Testing | Vitest + Testing Library + jsdom |
| Package manager | Bun |
| Environment | devenv (Nix) |

## Getting started

Requires [Bun](https://bun.sh). Then:

```bash
bun install
bun run dev       # local dev server
```

Other scripts:

```bash
bun run test      # run the test suite
bun run lint      # ESLint
bun run build     # type-check + production build
bun run preview   # preview the production build
```

## Documentation

- [`docs/guide.md`](docs/guide.md) — the project vision, architecture decisions, notes-system design, and development roadmap.
- [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md) — development notes: commands, project map, and code conventions.
- [`docs/DESIGN.md`](docs/DESIGN.md) — design tokens, typography, and motion rules.

## Roadmap

The site is under active development. Done so far: the foundation (design system, component kit, testing, CI), the homepage with hero/section animations and language switching, and the footer. Next up: About, Projects, and Contact pages, followed by a Markdown notes system fed from a private Obsidian vault. The full roadmap lives in [`docs/guide.md`](docs/guide.md).

## License

Licensed under [CC BY-NC 4.0](LICENSE) (Attribution-NonCommercial 4.0 International). You may use, copy, and adapt this project for personal, non-commercial purposes, provided you credit Rodrigo dos Santos Lima and link back to this repository. Commercial use requires separate permission — [get in touch](mailto:mail@matuz.me).

## Contact

- Email — [mail@matuz.me](mailto:mail@matuz.me)
- GitHub — [github.com/rodrigo-matuz](https://www.github.com/rodrigo-matuz)
- LinkedIn — [rodrigo-santos-m0117](https://www.linkedin.com/in/rodrigo-santos-m0117)

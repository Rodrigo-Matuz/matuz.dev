# Component notes

Components are organized **folder-per-component**: each folder contains the component file, its colocated test, and an `index.ts` barrel.

```text
ui/Button/
├── Button.tsx        # implementation (default export)
├── Button.test.tsx   # colocated tests
└── index.ts          # export { default } from './Button'
```

Import via the folder — the barrel resolves it, so there's no `Button/Button` repetition:

```ts
import Button from '$/components/ui/Button';
import type { ButtonProps } from '$/components/ui/Button'; // named type re-exports
```

This folder is split by responsibility:

- `layout/` provides page-level primitives: `Container` (max-width + gutters), `Section` (rhythm wrapper with optional `band` / `band="soft"` solid background bands), `SectionHeading` (eyebrow + display-serif title, with a `split` two-column layout), `Header` (fixed chrome that hides on scroll down and reappears on scroll up) and `Footer`, and `PageBackground`.
- `ui/` contains neutral building blocks: `Button` (uppercase CTA with `color` variants; renders as `<a>` when given `href`), `Eyebrow` (colored micro-label), `ArrowLink` (text link + animated diagonal arrow), `LanguageMenu` (self-contained bilingual switcher with SVG flags via `flag-icons`), `BrandIcon` (inline GitHub/LinkedIn/RSS glyphs, lucide-react dropped brand icons so these are local), plus `Badge`, `Card`, `Divider`, `IconButton` for upcoming sections.
- `content/` contains portfolio-specific presentations (`ProjectCard`, `SocialLink`, `TechBadge`) awaiting real data in `src/data/`.

Prefer composing these pieces over duplicating their borders, spacing, and interaction rules in pages. Components receive `className` for small contextual adjustments; visual tokens come from the theme in `src/index.css`.

Stateful components (`LanguageMenu`) own their own open/close behavior; pages pass only data and callbacks (`language`, `onLanguageChange`).

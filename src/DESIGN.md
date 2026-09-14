# Design notes

## Intent

The homepage should feel quiet, precise, and editorial. Its reference is the formal, archival composition of Palácio Assombrado: a clear masthead, a single dramatic statement, small document-like labels, and generous empty space. The dark foundation, display serif, thin dividers, and restrained motion give the blue-violet identity room to feel premium. Avoid generic dashboard cards, excessive rounded corners, or competing glows.

## Tailwind theme tokens

| Role | Token | Value |
| --- | --- | --- |
| Primary action / links | `primary` | `#1e65ff` |
| Violet depth / selection | `secondary` | `#702ef3` |
| Accent only | `accent` | `#fc1a70` |
| Page background | `background` | `#050505` |
| Default surface | `surface` | `#101010` |
| Raised surface | `surface-raised` | `#151515` |
| Divider | `border` | `#252525` |
| Main text | `foreground` | `#f5f5f5` |
| Supporting text | `muted` / `subtle` | `#a1a1aa` / `#71717a` |

Use tokens as Tailwind classes, e.g. `text-primary`, `bg-surface`, and `border-border`. The canonical definitions live in `index.css` under `@theme`.

## Future background image

`PageBackground` accepts an optional `src` prop. The current placeholder is `src/assets/hero-background.webp`; when the AI artwork is ready, swap the import in `src/pages/HomePage.tsx` and render `<PageBackground src={artwork} />`. Keep the image low-contrast (the component already sets opacity) so it supports rather than competes with page copy.

## Typography

Loaded via Google Fonts in `index.html`:

| Role | Font | Stack token |
| --- | --- | --- |
| Body / UI | Inter | `--font-sans` |
| Mono micro-labels | JetBrains Mono | `--font-mono` |
| Display serif headings | Newsreader | `--font-display` |

`font-display` is used for headings and editorial statements; `font-mono` for the small uppercase document-like labels. System fallbacks remain in the stacks for offline/failure cases.

## Component layer

Reusable primitives live in `src/components/` and encode these design rules:

- `Container` — max-width + responsive gutters (use instead of repeating `mx-auto max-w-7xl px-*`).
- `Section` — vertical rhythm wrapper; `band` / `band="soft"` gives the alternating blurred background bands (`/75` and `/40` opacity respectively).
- `Eyebrow` — the small uppercase mono label; accepts a theme `color` and optional `line`.
- `Button` — square-edged uppercase CTA with `color` variants (`accent`, `primary`, `outline`); renders as `<a>` when given `href`.
- `ArrowLink` — text link with the animated diagonal arrow.

## Motion

Central presets live in `src/lib/motion.ts` (`EASE`, `fadeUp`, `fade`, `staggerContainer`, `viewportOnce`) and are applied across the homepage: the hero staggers in on load, content sections reveal on scroll (`whileInView` + `viewportOnce`), and language switches fade/rise the page content via animation controls. Keep animations restrained: entrances and hover micro-interactions only, honoring `prefers-reduced-motion` in the upcoming accessibility pass.

## Editable site content

Content lives in the bilingual locale dictionaries — `src/content/pt-br.json` (default) and `src/content/eng.json` — loaded by `src/content/index.ts`. Update `owner`, `links`, and section copy there. The correspondence email (`mail@matuz.me`) is in `correspondence.emailHref`.

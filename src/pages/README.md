# Pages

Pages follow the same **folder-per-page** convention as components: each page lives in its own folder with the page file, its colocated test, and an `index.ts` barrel.

```text
pages/HomePage/
├── HomePage.tsx        # implementation (named + default export)
├── HomePage.test.tsx   # colocated tests
└── index.ts            # export { HomePage } from './HomePage'
```

Import via the folder — the barrel resolves it, avoiding `HomePage/HomePage` repetition:

```ts
import HomePage from '$/pages/HomePage';
```

Current pages: `HomePage` (`/`), `AboutPage` (`/about`), and `ProjectsPage` (`/projects`). Routes are registered in `src/App.tsx`, where `AnimatePresence` crossfades between them on route change. When adding a page, create a matching folder here, add its route, and wrap the page content in `PageShell` (header, background, footer, language-switch fade) — the page body itself is a `motion.article` using the `pageVariants` preset from `$/lib/motion` so its exit animation plays.

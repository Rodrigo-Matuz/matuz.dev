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

Routes are registered in `src/App.tsx`. When adding a page, create a matching folder here and add its route.

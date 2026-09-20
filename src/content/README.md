# Site copy and translations

All visible site copy (home and about pages) belongs in the locale dictionaries:

- `eng.json` — English (`en`)
- `pt-br.json` — Brazilian Portuguese (`pt-BR`, the default)

Keep their keys and array order identical. `index.ts` is deliberately code-only and exposes the dictionaries (plus the `Language` type) to the app.

## Structure

Top-level keys: `languageName`, `shortLabel`, `countryCode` (ISO 3166-1 alpha-2, lowercase — used by `flag-icons` for the SVG flag), `navigation`, `owner`, `links`, `hero`, `record`, `experience`, `approach`, `correspondence`, `projects`, `contact`, `about`, `footer`, `notes`.

`correspondence.email` / `correspondence.emailHref` hold the contact email (`mail@matuz.me`). The `about` section holds the `/about` page copy: `sitePurpose` (what this site is for) and `whoAmI` (intro, bio, skills, certificates, languages). The biography is derived from the owner's CV — the PDF itself is personal, git-ignored, and never committed or shipped. The `projects` section holds the `/projects` page: heading copy, `sourceLabel`/`previewLabel`, and `cards` — each with a stable `id` (same across locales, used for parity checks and React keys), `title`, `description`, `technologies`, `github`, and optional `image` (asset URL, `null` when unused) and `preview` (external URL or internal route path). Card titles may be localized; `id` may not.

## Rules

- Never hard-code user-facing strings in components — add them here in both locales.
- External `href`s are shared content (GitHub, LinkedIn, Discord); contact destinations are rendered through `SafeLink` (scrape-resistant) at the component layer — the JSON still holds the real values.
- When adding a key, add it to **both** files or TypeScript will surface the mismatch on the `locales` object.

## Tests

`content.test.ts` enforces locale parity: identical structure across locales (recursive shape comparison), non-empty strings, valid hrefs, the real email in both languages, and the owner's name never being "translated". If you add or rename a key, update both JSON files — the tests will catch drift.

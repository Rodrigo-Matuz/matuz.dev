# Homepage copy and translations

All visible homepage copy belongs in the locale dictionaries:

- `eng.json` — English (`en`)
- `pt-br.json` — Brazilian Portuguese (`pt-BR`, the default)

Keep their keys and array order identical. `index.ts` is deliberately code-only and exposes the dictionaries (plus the `Language` type) to the app.

## Structure

Top-level keys: `languageName`, `shortLabel`, `countryCode` (ISO 3166-1 alpha-2, lowercase — used by `flag-icons` for the SVG flag), `navigation`, `owner`, `links`, `hero`, `record`, `experience`, `approach`, `correspondence`, `footer`.

`correspondence.email` / `correspondence.emailHref` hold the contact email (`mail@matuz.me`).

## Rules

- Never hard-code user-facing strings in components — add them here in both locales.
- External `href`s are shared content (GitHub, LinkedIn); the Blog entry is still a `"#"` placeholder awaiting the notes system.
- When adding a key, add it to **both** files or TypeScript will surface the mismatch on the `locales` object.

## Tests

`content.test.ts` enforces locale parity: identical structure across locales (recursive shape comparison), non-empty strings, valid hrefs, the real email in both languages, and the owner's name never being "translated". If you add or rename a key, update both JSON files — the tests will catch drift.

/**
 * Compatibility shim — the app imports locale dictionaries from `$/content`.
 * The dictionaries themselves now live in `src/i18n/` (one file per section,
 * per language); this folder keeps the public import path and the parity
 * tests stable.
 */

export { locales, type Language } from '../i18n';

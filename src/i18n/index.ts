/**
 * Locale dictionaries, split per section.
 *
 * Each language lives in its own folder (`en/`, `pt-BR/`) with one JSON file
 * per site section (common, home, projects, contact, about, notes). This
 * module merges them back into the single-dictionary shape the app consumes
 * (`locales.en.hero`, `locales['pt-BR'].contact`, …), so consumers never see
 * the file split.
 *
 * When adding a section: create the file in BOTH language folders, import it
 * below, and add it to the merge — the parity test in `src/content/` will
 * catch shape drift between languages.
 */

import enCommon from './en/common.json';
import enHome from './en/home.json';
import enProjects from './en/projects.json';
import enContact from './en/contact.json';
import enAbout from './en/about.json';
import enNotes from './en/notes.json';

import ptCommon from './pt-BR/common.json';
import ptHome from './pt-BR/home.json';
import ptProjects from './pt-BR/projects.json';
import ptContact from './pt-BR/contact.json';
import ptAbout from './pt-BR/about.json';
import ptNotes from './pt-BR/notes.json';

export const locales = {
    en: {
        ...enCommon,
        ...enHome,
        ...enProjects,
        ...enContact,
        ...enAbout,
        ...enNotes,
    },
    'pt-BR': {
        ...ptCommon,
        ...ptHome,
        ...ptProjects,
        ...ptContact,
        ...ptAbout,
        ...ptNotes,
    },
} as const;

export type Language = keyof typeof locales;

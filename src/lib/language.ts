/**
 * App-wide language state.
 *
 * Language used to live in HomePage's local state; with two pages it must be
 * shared, so it lives in a tiny external store consumed through
 * `useSyncExternalStore` (React 18+ idiom, no context/redux needed).
 */

import { useSyncExternalStore } from 'react';

import { locales, type Language } from '$/content';

export type { Language };

let currentLanguage: Language = 'pt-BR';

const listeners = new Set<() => void>();

export function getLanguage(): Language {
    return currentLanguage;
}

export function setLanguage(language: Language): void {
    if (language === currentLanguage) return;

    currentLanguage = language;
    document.documentElement.lang = language;

    for (const listener of listeners) {
        listener();
    }
}

export function subscribeLanguage(listener: () => void): () => void {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
}

/** Locale dictionary for the current language. */
export function getLocale() {
    return locales[currentLanguage];
}

/** Hook — subscribes the component to language changes. */
export function useLanguage(): Language {
    return useSyncExternalStore(subscribeLanguage, getLanguage, getLanguage);
}

/** Hook — locale dictionary for the current language, reactive. */
export function useLocale() {
    return locales[useLanguage()];
}

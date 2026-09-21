/**
 * App-wide language state.
 *
 * Language used to live in HomePage's local state; with two pages it must be
 * shared, so it lives in a tiny external store consumed through
 * `useSyncExternalStore` (React 18+ idiom, no context/redux needed).
 */

import { useSyncExternalStore } from "react";

import { locales, type Language } from "$/content";

export type { Language };

/**
 * Detect the browser's preferred language on first load: `en` → English,
 * `pt-BR`/`pt` → Portuguese, anything else → English (the site's fallback).
 * Only applies when the user hasn't picked a language yet (no localStorage
 * entry) — an explicit choice always wins.
 */
function detectInitialLanguage(): Language {
    try {
        const stored = localStorage.getItem("matuz.dev:language");

        if (stored === "en" || stored === "pt-BR") {
            return stored;
        }
    } catch {
        // localStorage unavailable (private mode, etc.) — fall through.
    }

    const languages = navigator.languages ?? [navigator.language];

    for (const tag of languages) {
        const normalized = tag.toLowerCase();

        if (normalized.startsWith("pt")) return "pt-BR";
        if (normalized.startsWith("en")) return "en";
    }

    return "en";
}

let currentLanguage: Language = detectInitialLanguage();

const listeners = new Set<() => void>();

export function getLanguage(): Language {
    return currentLanguage;
}

export function setLanguage(language: Language): void {
    if (language === currentLanguage) return;

    currentLanguage = language;
    document.documentElement.lang = language;

    // Persist the explicit choice so browser detection doesn't override it
    // on the next visit.
    try {
        localStorage.setItem("matuz.dev:language", language);
    } catch {
        // localStorage unavailable — language still applies for this session.
    }

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

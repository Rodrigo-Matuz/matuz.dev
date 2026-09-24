import { useEffect } from 'react';

interface PageMeta {
    /** Browser-tab / OG / Twitter title for the current route. */
    title: string;
    /** Meta description; omit to keep the previous one (e.g. note pages). */
    description?: string;
    /** Keep non-existent routes (404, missing note) out of search indexes. */
    noIndex?: boolean;
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
    let element = document.head.querySelector<HTMLMetaElement>(
        `meta[${attr}="${key}"]`,
    );

    if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
    }

    element.setAttribute('content', content);
}

/**
 * Per-route document metadata for the SPA: tab title, meta description, and
 * the OG/Twitter mirrors (for crawlers and link previews that render JS).
 * Re-runs when the values change — pages pass locale-driven strings, so a
 * language switch refreshes the metadata too.
 */
export function usePageMeta({ title, description, noIndex }: PageMeta) {
    useEffect(() => {
        document.title = title;

        setMeta('property', 'og:title', title);
        setMeta('name', 'twitter:title', title);
        setMeta(
            'property',
            'og:url',
            `${window.location.origin}${window.location.pathname}`,
        );

        if (description) {
            setMeta('name', 'description', description);
            setMeta('property', 'og:description', description);
            setMeta('name', 'twitter:description', description);
        }

        if (noIndex) {
            setMeta('name', 'robots', 'noindex');
        } else {
            // Only remove the tag this hook manages (content="noindex") —
            // never a hand-written robots directive from index.html.
            document.head
                .querySelectorAll<HTMLMetaElement>(
                    'meta[name="robots"][content="noindex"]',
                )
                .forEach((element) => element.remove());
        }
    }, [title, description, noIndex]);
}

export default usePageMeta;

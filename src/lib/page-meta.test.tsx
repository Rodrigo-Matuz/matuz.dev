import { render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { usePageMeta } from './page-meta';

function Probe(props: Parameters<typeof usePageMeta>[0]) {
    usePageMeta(props);

    return null;
}

const renderMeta = (props: Parameters<typeof usePageMeta>[0]) =>
    render(<Probe {...props} />);

const metaContent = (selector: string) =>
    document.head.querySelector<HTMLMetaElement>(selector)?.getAttribute(
        'content',
    );

describe('usePageMeta', () => {
    afterEach(() => {
        document.head
            .querySelectorAll('meta')
            .forEach((element) => element.remove());
        document.title = '';
    });

    it('sets the document title and mirrors it to OG/Twitter', () => {
        renderMeta({ title: 'Test page · matuz.dev' });

        expect(document.title).toBe('Test page · matuz.dev');
        expect(metaContent('meta[property="og:title"]')).toBe(
            'Test page · matuz.dev',
        );
        expect(metaContent('meta[name="twitter:title"]')).toBe(
            'Test page · matuz.dev',
        );
    });

    it('sets the description across meta channels', () => {
        renderMeta({ title: 't', description: 'A page description.' });

        expect(metaContent('meta[name="description"]')).toBe(
            'A page description.',
        );
        expect(metaContent('meta[property="og:description"]')).toBe(
            'A page description.',
        );
        expect(metaContent('meta[name="twitter:description"]')).toBe(
            'A page description.',
        );
    });

    it('keeps an existing description when none is passed', () => {
        renderMeta({ title: 'first', description: 'kept' });
        renderMeta({ title: 'second' });

        expect(document.title).toBe('second');
        expect(metaContent('meta[name="description"]')).toBe('kept');
    });

    it('marks noIndex pages and clears the mark on the next route', () => {
        renderMeta({ title: 'missing', noIndex: true });

        expect(metaContent('meta[name="robots"]')).toBe('noindex');

        renderMeta({ title: 'found' });

        expect(metaContent('meta[name="robots"]')).toBeUndefined();
    });

    it('points og:url at the current path', () => {
        renderMeta({ title: 't' });

        expect(metaContent('meta[property="og:url"]')).toBe(
            `${window.location.origin}/`,
        );
    });
});

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import PageShell from './PageShell';
import { locales } from '$/content';

// jsdom lacks IntersectionObserver, which Motion's whileInView uses.
beforeAll(() => {
    class MockIntersectionObserver implements IntersectionObserver {
        readonly root = null;
        readonly rootMargin = '';
        readonly scrollMargin = '';
        readonly thresholds = [];
        disconnect() {}
        observe() {}
        unobserve() {}
        takeRecords(): IntersectionObserverEntry[] {
            return [];
        }
    }

    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
});

const renderShell = () =>
    render(
        <MemoryRouter>
            <PageShell>
                <p>Page body</p>
            </PageShell>
        </MemoryRouter>,
    );

describe('PageShell', () => {
    it('renders the page body inside the main landmark', () => {
        renderShell();

        expect(screen.getByText('Page body')).toBeInTheDocument();
    });

    it('exposes a skip link pointing at the main content', () => {
        renderShell();

        // Test setup pins the language to pt-BR.
        const skipLink = screen.getByRole('link', {
            name: locales['pt-BR'].navigation.skipToContent,
        });

        expect(skipLink).toHaveAttribute('href', '#top');
    });
});

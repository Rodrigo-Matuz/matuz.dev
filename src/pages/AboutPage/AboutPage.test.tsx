import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { AboutPage } from './AboutPage';
import { locales } from '$/content';

// PageShell's Header reads the router location; pages must render inside one.
const renderPage = () =>
    render(
        <MemoryRouter>
            <AboutPage />
        </MemoryRouter>,
    );

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

describe('AboutPage', () => {
    it('renders the page title from the default locale (pt-BR)', () => {
        renderPage();

        const heading = screen.getByRole('heading', { level: 1 });

        expect(heading).toHaveTextContent(locales['pt-BR'].about.title);
    });

    it('explains what the site is for', () => {
        renderPage();

        for (const paragraph of locales['pt-BR'].about.sitePurpose) {
            expect(screen.getByText(paragraph)).toBeInTheDocument();
        }
    });

    it('presents the who-am-I section', () => {
        renderPage();

        expect(
            screen.getByText(locales['pt-BR'].about.whoAmI.intro),
        ).toBeInTheDocument();

        for (const paragraph of locales['pt-BR'].about.whoAmI.bio) {
            expect(screen.getByText(paragraph)).toBeInTheDocument();
        }
    });

    it('lists every skill group', () => {
        renderPage();

        for (const group of locales['pt-BR'].about.whoAmI.skills.groups) {
            expect(screen.getByText(group.label)).toBeInTheDocument();
            expect(screen.getByText(group.items)).toBeInTheDocument();
        }
    });

    it('lists certificates and languages', () => {
        renderPage();

        const { certificates } = locales['pt-BR'].about.whoAmI;

        for (const certificate of certificates.items) {
            expect(screen.getByText(certificate)).toBeInTheDocument();
        }

        for (const language of certificates.languages) {
            expect(screen.getByText(language)).toBeInTheDocument();
        }
    });

    it('links back to the home page', () => {
        renderPage();

        const backLink = screen.getByRole('link', {
            name: new RegExp(
                locales['pt-BR'].correspondence.secondaryAction,
                'i',
            ),
        });

        // Renders as a react-router Link; the resolved anchor href is the path.
        expect(backLink).toHaveAttribute('href', '/');
    });

    it('renders the footer with the owner name', () => {
        renderPage();

        const footer = screen.getByRole('contentinfo');

        expect(footer).toHaveTextContent(locales['pt-BR'].owner.displayName);
    });
});

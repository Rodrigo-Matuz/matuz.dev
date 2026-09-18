import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { HomePage } from './HomePage';
import { locales } from '$/content';

// PageShell's Header reads the router location; pages must render inside one.
const renderPage = () =>
    render(
        <MemoryRouter>
            <HomePage />
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

describe('HomePage', () => {
    it('renders the hero title from the default locale (pt-BR)', () => {
        renderPage();

        const heading = screen.getByRole('heading', { level: 1 });

        expect(heading).toHaveTextContent(locales['pt-BR'].hero.title);
    });

    it('renders all main sections', () => {
        renderPage();

        expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(4);
        expect(screen.getByText(locales['pt-BR'].record.title));
        expect(screen.getByText(locales['pt-BR'].experience.title));
        expect(screen.getByText(locales['pt-BR'].approach.title));
        expect(screen.getByText(locales['pt-BR'].correspondence.title));
    });

    it('renders every record entry', () => {
        renderPage();

        for (const entry of locales['pt-BR'].record.entries) {
            expect(screen.getByText(entry.title)).toBeInTheDocument();
        }
    });

    it('renders the numbered experience highlights in order', () => {
        renderPage();

        const list = screen.getByRole('list');

        expect(list).toHaveAttribute('id', 'experience-highlights');

        const items = list.querySelectorAll('li');

        expect(items).toHaveLength(
            locales['pt-BR'].experience.highlights.length,
        );
        expect(items[0]).toHaveTextContent(
            locales['pt-BR'].experience.highlights[0],
        );
    });

    it('links the contact button to the real email', () => {
        renderPage();

        const contact = screen.getByRole('link', {
            name: new RegExp(locales['pt-BR'].correspondence.primaryAction),
        });

        expect(contact).toHaveAttribute(
            'href',
            locales['pt-BR'].correspondence.emailHref,
        );
    });

    it('renders the correspondence links with index numbers', () => {
        renderPage();

        const { links } = locales['pt-BR'];

        // Header links + correspondence list links (header first).
        for (const link of links) {
            const anchors = screen.getAllByRole('link', {
                name: new RegExp(link.label, 'i'),
            });

            expect(anchors.length).toBeGreaterThanOrEqual(2);
        }
    });

    it('switches all visible copy when the language changes', async () => {
        const user = userEvent.setup();

        renderPage();

        await user.click(
            screen.getByRole('button', {
                name: locales['pt-BR'].navigation.languageSelector,
            }),
        );
        await user.click(
            screen.getByRole('menuitemradio', { name: /english/i }),
        );

        expect(
            screen.getByRole('heading', { level: 1 }),
        ).toHaveTextContent(locales.en.hero.title);
        expect(
            screen.getByText(locales.en.correspondence.title),
        ).toBeInTheDocument();
    });

    it('updates the document language attribute on switch', async () => {
        const user = userEvent.setup();

        renderPage();

        expect(document.documentElement.lang).toBe('pt-BR');

        await user.click(
            screen.getByRole('button', {
                name: locales['pt-BR'].navigation.languageSelector,
            }),
        );
        await user.click(
            screen.getByRole('menuitemradio', { name: /english/i }),
        );

        expect(document.documentElement.lang).toBe('en');
    });

    it('renders the footer with the owner name', () => {
        renderPage();

        const footer = screen.getByRole('contentinfo');

        expect(footer).toHaveTextContent(
            locales['pt-BR'].owner.displayName,
        );
    });

    it('provides anchor targets for in-page navigation', () => {
        const { container } = renderPage();

        expect(container.querySelector('#record')).not.toBeNull();
        expect(container.querySelector('#experience')).not.toBeNull();
        expect(container.querySelector('#experience-highlights')).not.toBeNull();
        expect(container.querySelector('#correspondence')).not.toBeNull();
    });
});

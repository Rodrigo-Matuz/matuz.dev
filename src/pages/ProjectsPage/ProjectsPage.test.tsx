import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { ProjectsPage } from './ProjectsPage';
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

// PageShell's Header reads the router location; pages must render inside one.
const renderPage = () =>
    render(
        <MemoryRouter>
            <ProjectsPage />
        </MemoryRouter>,
    );

describe('ProjectsPage', () => {
    it('renders the page title from the default locale (pt-BR)', () => {
        renderPage();

        const heading = screen.getByRole('heading', { level: 1 });

        expect(heading).toHaveTextContent(locales['pt-BR'].projects.title);
    });

    it('renders every project card', () => {
        renderPage();

        const { cards } = locales['pt-BR'].projects;

        for (const card of cards) {
            expect(
                screen.getByRole('heading', { name: card.title }),
            ).toBeInTheDocument();
            expect(screen.getByText(card.description)).toBeInTheDocument();
        }
    });

    it('renders every technology tag of every card', () => {
        renderPage();

        const { cards } = locales['pt-BR'].projects;
        const allTags = cards.flatMap((card) => card.technologies);

        for (const tag of allTags) {
            // Tags repeat across cards (e.g. TypeScript) — assert presence.
            expect(screen.getAllByText(tag).length).toBeGreaterThan(0);
        }
    });

    it('links every card source to GitHub', () => {
        renderPage();

        const { cards, sourceLabel } = locales['pt-BR'].projects;

        // Each card renders two source links: the title (accessible name
        // combines title + label) and the footer label. Assert per card so
        // the pairs are matched unambiguously.
        for (const card of cards) {
            const links = screen
                .getAllByRole('link')
                .filter(
                    (link) =>
                        link.getAttribute('href') === card.github &&
                        link
                            .getAttribute('aria-label')
                            ?.includes(card.title) !== false,
                );

            const titleLink = links.find((link) =>
                (link.getAttribute('aria-label') ?? '').includes(card.title),
            );
            const footerLink = links.find(
                (link) => link.getAttribute('aria-label') === null,
            );

            expect(titleLink, card.id).toBeDefined();
            expect(footerLink, card.id).toBeDefined();
            expect(titleLink).toHaveTextContent(card.title);
            expect(footerLink).toHaveTextContent(sourceLabel);
        }
    });

    it('gives every card a preview link (demo page or external)', () => {
        renderPage();

        const { cards, previewLabel } = locales['pt-BR'].projects;
        const previewLinks = screen.getAllByRole('link', {
            name: new RegExp(previewLabel, 'i'),
        });

        // Every card now links to its demo page (/projects/:id) unless it
        // declares an external preview.
        expect(previewLinks).toHaveLength(cards.length);

        for (const [index, link] of previewLinks.entries()) {
            const expected = cards[index].preview ?? `/projects/${cards[index].id}`;

            expect(link).toHaveAttribute('href', expected);
        }
    });

    it('renders the closing contact button with the real email', () => {
        renderPage();

        const contact = screen.getByRole('link', {
            name: new RegExp(
                locales['pt-BR'].correspondence.primaryAction,
                'i',
            ),
        });

        expect(contact).toHaveAttribute(
            'href',
            locales['pt-BR'].correspondence.emailHref,
        );
    });

    it('renders the footer with the owner name', () => {
        renderPage();

        const footer = screen.getByRole('contentinfo');

        expect(footer).toHaveTextContent(
            locales['pt-BR'].owner.displayName,
        );
    });
});

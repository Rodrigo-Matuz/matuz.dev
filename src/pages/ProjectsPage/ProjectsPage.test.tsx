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
        const sourceLinks = screen.getAllByRole('link', {
            name: new RegExp(sourceLabel, 'i'),
        });

        expect(sourceLinks).toHaveLength(cards.length);

        for (const [index, link] of sourceLinks.entries()) {
            expect(link).toHaveAttribute('href', cards[index].github);
        }
    });

    it('renders the optional preview link only for cards that have one', () => {
        renderPage();

        const { cards, previewLabel } = locales['pt-BR'].projects;
        const withPreview = cards.filter((card) => card.preview);
        const previewLinks = screen.getAllByRole('link', {
            name: new RegExp(previewLabel, 'i'),
        });

        expect(previewLinks).toHaveLength(withPreview.length);

        for (const [index, link] of previewLinks.entries()) {
            expect(link).toHaveAttribute('href', withPreview[index].preview);
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

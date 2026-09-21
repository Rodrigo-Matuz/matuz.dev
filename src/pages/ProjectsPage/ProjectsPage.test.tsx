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

    it('gives every card an About link to its demo page', () => {
        const { container } = renderPage();

        const { cards, aboutLabel } = locales['pt-BR'].projects;

        // Scope to the card grid — the header nav link is also "Sobre".
        const grid = container.querySelector('#projects-grid')!;
        const aboutLinks = Array.from(grid.querySelectorAll('a')).filter((a) =>
            new RegExp(aboutLabel, 'i').test(a.textContent ?? ''),
        );

        expect(aboutLinks).toHaveLength(cards.length);

        for (const [index, link] of aboutLinks.entries()) {
            expect(link).toHaveAttribute('href', `/projects/${cards[index].id}`);
            expect(link).not.toHaveAttribute('target');
        }
    });

    it('renders the Demo button only for cards with an external preview', () => {
        const { container } = renderPage();

        const { cards, previewLabel } = locales['pt-BR'].projects;
        const withPreview = cards.filter((card) => card.preview);

        // Scope to the card grid to avoid the header's social links.
        const grid = container.querySelector('#projects-grid')!;
        const previewLinks = Array.from(grid.querySelectorAll('a')).filter((a) =>
            new RegExp(previewLabel, 'i').test(a.textContent ?? ''),
        );

        expect(previewLinks).toHaveLength(withPreview.length);

        for (const [index, link] of previewLinks.entries()) {
            expect(link).toHaveAttribute('href', withPreview[index].preview!);

            // External previews open in a new tab; internal ones don't.
            if (withPreview[index].preview!.startsWith('http')) {
                expect(link).toHaveAttribute('target', '_blank');
            } else {
                expect(link).not.toHaveAttribute('target');
            }
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

import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { ProjectDemoPage } from './ProjectDemoPage';
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

// The page reads :slug, so it must mount inside a Route.
const renderPage = (slug: string) =>
    render(
        <MemoryRouter initialEntries={[`/projects/${slug}`]}>
            <Routes>
                <Route path="/projects/:slug" element={<ProjectDemoPage />} />
            </Routes>
        </MemoryRouter>,
    );

describe('ProjectDemoPage', () => {
    it('renders the title and tech tags for a known slug', () => {
        renderPage('wallpaper-picker');

        const card = locales['pt-BR'].projects.cards.find(
            (candidate) => candidate.id === 'wallpaper-picker',
        );

        expect(
            screen.getByRole('heading', { level: 1, name: card!.title }),
        ).toBeInTheDocument();

        for (const technology of card!.technologies) {
            expect(screen.getByText(technology)).toBeInTheDocument();
        }
    });

    it('renders the demo paragraphs', () => {
        renderPage('wallpaper-picker');

        const card = locales['pt-BR'].projects.cards.find(
            (candidate) => candidate.id === 'wallpaper-picker',
        );

        for (const paragraph of card!.demo!.paragraphs) {
            expect(screen.getByText(paragraph)).toBeInTheDocument();
        }
    });

    it('embeds a YouTube iframe when the demo video is a YouTube URL', () => {
        renderPage('wallpaper-picker');

        // The wallpaper-picker demo video is a YouTube link → iframe embed.
        const iframe = document.querySelector('iframe');

        expect(iframe).not.toBeNull();
        expect(iframe?.src).toContain('youtube-nocookie.com/embed/5_KZSFZyBGA');
        expect(iframe).toHaveAttribute(
            'title',
            locales['pt-BR'].projects.demo.videoTitle,
        );
        expect(document.querySelector('video')).toBeNull();
    });

    it('renders no native video element for YouTube demo videos', () => {
        renderPage('wallpaper-picker');

        // YouTube links render as an iframe embed, not a native <video>.
        expect(document.querySelector('video')).toBeNull();
    });

    it('shows the no-video notice for projects without a demo video', () => {
        renderPage('cinema-automation-challenge');

        expect(
            screen.getByText(locales['pt-BR'].projects.demo.noVideo),
        ).toBeInTheDocument();
        expect(document.querySelector('iframe')).toBeNull();
    });

    it('links the source to GitHub', () => {
        renderPage('wallpaper-picker');

        const card = locales['pt-BR'].projects.cards.find(
            (candidate) => candidate.id === 'wallpaper-picker',
        );

        const source = screen.getByRole('link', {
            name: new RegExp(locales['pt-BR'].projects.sourceLabel, 'i'),
        });

        expect(source).toHaveAttribute('href', card!.github);
        expect(source).toHaveAttribute('target', '_blank');
    });

    it('renders the preview link for cards that declare one', () => {
        renderPage('matuz-dev');

        const preview = screen.getByRole('link', {
            name: new RegExp(locales['pt-BR'].projects.previewLabel, 'i'),
        });

        expect(preview).toHaveAttribute('href', '/');
    });

    it('omits the preview link for cards without one', () => {
        renderPage('cinema-automation-challenge');

        expect(
            screen.queryByRole('link', {
                name: new RegExp(locales['pt-BR'].projects.previewLabel, 'i'),
            }),
        ).toBeNull();
    });

    it('links back to the projects index', () => {
        renderPage('wallpaper-picker');

        const backLinks = screen.getAllByRole('link', {
            name: new RegExp(locales['pt-BR'].projects.backToProjects, 'i'),
        });

        expect(backLinks.length).toBeGreaterThan(0);

        for (const link of backLinks) {
            expect(link).toHaveAttribute('href', '/projects');
        }
    });

    it('shows the not-found state for unknown slugs', () => {
        renderPage('nope');

        expect(
            screen.getByText(locales['pt-BR'].notes.notFound),
        ).toBeInTheDocument();
        expect(
            screen.queryByRole('heading', { level: 1 }),
        ).not.toBeInTheDocument();
    });

    it('renders the footer with the owner name', () => {
        renderPage('wallpaper-picker');

        const footer = screen.getByRole('contentinfo');

        expect(footer).toHaveTextContent(locales['pt-BR'].owner.displayName);
    });
});

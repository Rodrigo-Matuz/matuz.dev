import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { NotFoundPage } from './NotFoundPage';
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
        <MemoryRouter initialEntries={['/anything-not-made']}>
            <NotFoundPage />
        </MemoryRouter>,
    );

describe('NotFoundPage', () => {
    it('renders the page title from the default locale (pt-BR)', () => {
        renderPage();

        const heading = screen.getByRole('heading', { level: 1 });

        expect(heading).toHaveTextContent(locales['pt-BR'].notFound.title);
    });

    it('explains that the requested page does not exist', () => {
        renderPage();

        expect(
            screen.getByText(locales['pt-BR'].notFound.description),
        ).toBeInTheDocument();
    });

    it('labels the miss with the 404 code', () => {
        renderPage();

        expect(
            screen.getByText(locales['pt-BR'].notFound.code),
        ).toBeInTheDocument();
    });

    it('links back to the home page', () => {
        renderPage();

        const link = screen.getByRole('link', {
            name: locales['pt-BR'].notFound.homeAction,
        });

        expect(link).toHaveAttribute('href', '/');
    });

    it('renders the footer with the owner name', () => {
        renderPage();

        const footer = screen.getByRole('contentinfo');

        expect(footer).toHaveTextContent(locales['pt-BR'].owner.displayName);
    });
});
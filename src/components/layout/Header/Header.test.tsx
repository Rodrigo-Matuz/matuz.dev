import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import Header from './Header';
import { locales } from '$/content';

interface HeaderTestProps {
    language?: 'en' | 'pt-BR';
    onLanguageChange?: (language: 'en' | 'pt-BR') => void;
    initialPath?: string;
}

const renderHeader = ({
    language = 'en',
    onLanguageChange = () => {},
    initialPath = '/',
}: HeaderTestProps = {}) =>
    render(
        <MemoryRouter initialEntries={[initialPath]}>
            <Header language={language} onLanguageChange={onLanguageChange} />
        </MemoryRouter>,
    );

describe('Header', () => {
    it('renders the site owner name as a home link', () => {
        renderHeader({ initialPath: '/about' });

        const nameLink = screen.getByRole('link', {
            name: locales.en.owner.displayName,
        });

        // Router Link — resolves to the home route, not an in-page anchor.
        expect(nameLink).toHaveAttribute('href', '/');
    });

    it('renders the About route link', () => {
        renderHeader();

        const aboutLink = screen.getByRole('link', {
            name: locales.en.navigation.about,
        });

        expect(aboutLink).toHaveAttribute('href', '/about');
    });

    it('renders the navigation links from content', () => {
        renderHeader();

        for (const link of locales.en.links) {
            expect(
                screen.getAllByRole('link', { name: link.label }).length,
            ).toBeGreaterThan(0);
        }
    });

    it('labels the nav for screen readers', () => {
        renderHeader();

        expect(
            screen.getByRole('navigation', {
                name: locales.en.navigation.primary,
            }),
        ).toBeInTheDocument();
    });

    it('shows the language menu trigger with the current short label', () => {
        renderHeader();

        const trigger = screen.getByRole('button', {
            name: locales.en.navigation.languageSelector,
        });

        expect(trigger).toHaveTextContent('ENG');
    });

    it('switches language through the menu', async () => {
        const onLanguageChange = vi.fn();
        const user = userEvent.setup();

        renderHeader({ onLanguageChange });

        await user.click(
            screen.getByRole('button', {
                name: locales.en.navigation.languageSelector,
            }),
        );
        await user.click(
            screen.getByRole('menuitemradio', { name: /português/i }),
        );

        expect(onLanguageChange).toHaveBeenCalledWith('pt-BR');
    });

    it('localizes the trigger label per language', () => {
        renderHeader({ language: 'pt-BR' });

        expect(
            screen.getByRole('button', {
                name: locales['pt-BR'].navigation.languageSelector,
            }),
        ).toHaveTextContent('PT-BR');
    });

    it('marks the About link as the current page on /about', () => {
        renderHeader({ initialPath: '/about' });

        const aboutLink = screen.getByRole('link', {
            name: locales.en.navigation.about,
        });

        expect(aboutLink).toHaveAttribute('aria-current', 'page');
    });

    describe('show on scroll up', () => {
        const fireScroll = (scrollY: number) => {
            Object.defineProperty(window, 'scrollY', {
                configurable: true,
                value: scrollY,
            });
            act(() => {
                window.dispatchEvent(new Event('scroll'));
            });
        };

        it('is visible near the top of the page', () => {
            Object.defineProperty(window, 'scrollY', {
                configurable: true,
                value: 0,
            });

            const { container } = renderHeader();

            const header = container.firstElementChild as HTMLElement;

            expect(header).toHaveClass('translate-y-0');
            expect(header).not.toHaveClass('-translate-y-full');
        });

        it('hides when scrolling down past the threshold', () => {
            Object.defineProperty(window, 'scrollY', {
                configurable: true,
                value: 0,
            });

            const { container } = renderHeader();

            fireScroll(200);

            const header = container.firstElementChild as HTMLElement;

            expect(header).toHaveClass('-translate-y-full');
        });

        it('reveals again when scrolling up', () => {
            Object.defineProperty(window, 'scrollY', {
                configurable: true,
                value: 0,
            });

            const { container } = renderHeader();

            fireScroll(200);
            fireScroll(150);

            const header = container.firstElementChild as HTMLElement;

            expect(header).toHaveClass('translate-y-0');
        });

        it('stays visible when scrolling down near the top', () => {
            Object.defineProperty(window, 'scrollY', {
                configurable: true,
                value: 0,
            });

            const { container } = renderHeader();

            fireScroll(40);

            const header = container.firstElementChild as HTMLElement;

            expect(header).toHaveClass('translate-y-0');
        });
    });
});

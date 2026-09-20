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

    it('renders the Projects route link', () => {
        renderHeader();

        const projectsLink = screen.getByRole('link', {
            name: locales.en.navigation.projects,
        });

        expect(projectsLink).toHaveAttribute('href', '/projects');
    });

    it('renders the navigation links from content', () => {
        renderHeader();

        for (const link of locales.en.links) {
            // Social links are icon-only on desktop; the accessible name
            // comes from the aria-label.
            expect(
                screen.getAllByRole('link', { name: link.label }).length,
            ).toBeGreaterThan(0);
        }
    });

    it('renders social links as icon-only with accessible names', () => {
        renderHeader();

        const github = screen.getAllByRole('link', {
            name: locales.en.links[0].label,
        })[0];

        expect(github).toHaveTextContent('');
        expect(github.querySelector('svg')).not.toBeNull();
    });

    it('opens the mobile menu with page and social links', async () => {
        const user = userEvent.setup();

        renderHeader();

        await user.click(
            screen.getByRole('button', { name: locales.en.navigation.menu }),
        );

        const menu = screen.getByRole('menu', {
            name: locales.en.navigation.primary,
        });

        expect(menu).toBeInTheDocument();
        expect(
            screen.getByRole('menuitem', { name: locales.en.navigation.about }),
        ).toHaveAttribute('href', '/about');
        expect(
            screen.getByRole('menuitem', {
                name: locales.en.navigation.projects,
            }),
        ).toHaveAttribute('href', '/projects');
        expect(
            screen.getByRole('menuitem', { name: locales.en.links[0].label }),
        ).toBeInTheDocument();

        // SafeLink: the href only exists after hover (anti-scraping).
        const socialItem = screen.getByRole('menuitem', {
            name: locales.en.links[0].label,
        });

        await user.hover(socialItem);

        expect(socialItem).toHaveAttribute('href', locales.en.links[0].href);
    });

    it('closes the mobile menu when a page link is chosen', async () => {
        const user = userEvent.setup();

        renderHeader();

        await user.click(
            screen.getByRole('button', { name: locales.en.navigation.menu }),
        );
        await user.click(
            screen.getByRole('menuitem', { name: locales.en.navigation.about }),
        );

        expect(
            screen.queryByRole('menu', {
                name: locales.en.navigation.primary,
            }),
        ).not.toBeInTheDocument();
    });

    it('closes the mobile menu via the close button', async () => {
        const user = userEvent.setup();

        renderHeader();

        await user.click(
            screen.getByRole('button', { name: locales.en.navigation.menu }),
        );
        await user.click(
            screen.getByRole('button', {
                name: locales.en.navigation.closeMenu,
            }),
        );

        expect(
            screen.queryByRole('menu', {
                name: locales.en.navigation.primary,
            }),
        ).not.toBeInTheDocument();
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

        // The header renders one LanguageMenu per breakpoint (desktop +
        // mobile); both show the current short label.
        const triggers = screen.getAllByRole('button', {
            name: locales.en.navigation.languageSelector,
        });

        expect(triggers.length).toBeGreaterThan(0);

        for (const trigger of triggers) {
            expect(trigger).toHaveTextContent('ENG');
        }
    });

    it('switches language through the menu', async () => {
        const onLanguageChange = vi.fn();
        const user = userEvent.setup();

        renderHeader({ onLanguageChange });

        await user.click(
            screen.getAllByRole('button', {
                name: locales.en.navigation.languageSelector,
            })[0],
        );
        await user.click(
            screen.getAllByRole('menuitemradio', { name: /português/i })[0],
        );

        expect(onLanguageChange).toHaveBeenCalledWith('pt-BR');
    });

    it('localizes the trigger label per language', () => {
        renderHeader({ language: 'pt-BR' });

        const triggers = screen.getAllByRole('button', {
            name: locales['pt-BR'].navigation.languageSelector,
        });

        for (const trigger of triggers) {
            expect(trigger).toHaveTextContent('PT-BR');
        }
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

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import Header from './Header';
import { locales } from '$/content';

describe('Header', () => {
    it('renders the site owner name as a home link', () => {
        render(
            <Header language="en" onLanguageChange={() => {}} />,
        );

        const nameLink = screen.getByRole('link', {
            name: locales.en.owner.displayName,
        });

        expect(nameLink).toHaveAttribute('href', '#top');
    });

    it('renders the navigation links from content', () => {
        render(
            <Header language="en" onLanguageChange={() => {}} />,
        );

        for (const link of locales.en.links) {
            expect(
                screen.getAllByRole('link', { name: link.label }).length,
            ).toBeGreaterThan(0);
        }
    });

    it('labels the nav for screen readers', () => {
        render(
            <Header language="en" onLanguageChange={() => {}} />,
        );

        expect(
            screen.getByRole('navigation', {
                name: locales.en.navigation.primary,
            }),
        ).toBeInTheDocument();
    });

    it('shows the language menu trigger with the current short label', () => {
        render(
            <Header language="en" onLanguageChange={() => {}} />,
        );

        const trigger = screen.getByRole('button', {
            name: locales.en.navigation.languageSelector,
        });

        expect(trigger).toHaveTextContent('ENG');
    });

    it('switches language through the menu', async () => {
        const onLanguageChange = vi.fn();
        const user = userEvent.setup();

        render(
            <Header language="en" onLanguageChange={onLanguageChange} />,
        );

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
        render(
            <Header language="pt-BR" onLanguageChange={() => {}} />,
        );

        expect(
            screen.getByRole('button', {
                name: locales['pt-BR'].navigation.languageSelector,
            }),
        ).toHaveTextContent('PT-BR');
    });
});

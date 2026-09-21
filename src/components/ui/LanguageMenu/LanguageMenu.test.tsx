import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import LanguageMenu from './LanguageMenu';

describe('LanguageMenu', () => {
    it('renders a closed trigger showing the current language', () => {
        render(<LanguageMenu language="pt-BR" onLanguageChange={() => {}} />);

        const trigger = screen.getByRole('button', {
            name: /escolher idioma/i,
        });

        expect(trigger).toHaveAttribute('aria-expanded', 'false');
        expect(trigger).toHaveTextContent('PT-BR');
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('opens the menu on click and lists both languages', async () => {
        const user = userEvent.setup();

        render(<LanguageMenu language="pt-BR" onLanguageChange={() => {}} />);

        await user.click(
            screen.getByRole('button', { name: /escolher idioma/i }),
        );

        const menu = screen.getByRole('menu');

        expect(menu).toBeInTheDocument();
        expect(screen.getByRole('menuitemradio', { name: /english/i }));
        expect(
            screen.getByRole('menuitemradio', { name: /português/i }),
        ).toHaveAttribute('aria-checked', 'true');
        expect(
            screen.getByRole('menuitemradio', { name: /english/i }),
        ).toHaveAttribute('aria-checked', 'false');
    });

    it('closes the menu on a second click', async () => {
        const user = userEvent.setup();

        render(<LanguageMenu language="pt-BR" onLanguageChange={() => {}} />);

        const trigger = screen.getByRole('button', {
            name: /escolher idioma/i,
        });

        await user.click(trigger);
        expect(screen.getByRole('menu')).toBeInTheDocument();

        await user.click(trigger);
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('calls onLanguageChange and closes when a language is picked', async () => {
        const onLanguageChange = vi.fn();
        const user = userEvent.setup();

        render(
            <LanguageMenu
                language="pt-BR"
                onLanguageChange={onLanguageChange}
            />,
        );

        await user.click(
            screen.getByRole('button', { name: /escolher idioma/i }),
        );
        await user.click(
            screen.getByRole('menuitemradio', { name: /english/i }),
        );

        expect(onLanguageChange).toHaveBeenCalledTimes(1);
        expect(onLanguageChange).toHaveBeenCalledWith('en');
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('closes the menu when re-selecting the current language', async () => {
        const onLanguageChange = vi.fn();
        const user = userEvent.setup();

        render(
            <LanguageMenu language="en" onLanguageChange={onLanguageChange} />,
        );

        await user.click(
            screen.getByRole('button', { name: /choose language/i }),
        );
        await user.click(
            screen.getByRole('menuitemradio', { name: /english/i }),
        );

        // The menu passes the selection through; the page guards same-language switches.
        expect(onLanguageChange).toHaveBeenCalledWith('en');
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('closes when clicking outside the menu', async () => {
        const user = userEvent.setup();

        render(
            <div>
                <div data-testid="outside" />
                <LanguageMenu language="pt-BR" onLanguageChange={() => {}} />
            </div>,
        );

        await user.click(
            screen.getByRole('button', { name: /escolher idioma/i }),
        );
        expect(screen.getByRole('menu')).toBeInTheDocument();

        await user.click(screen.getByTestId('outside'));
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('closes on Escape and returns focus to the trigger', async () => {
        const user = userEvent.setup();

        render(<LanguageMenu language="pt-BR" onLanguageChange={() => {}} />);

        const trigger = screen.getByRole('button', {
            name: /escolher idioma/i,
        });

        await user.click(trigger);
        expect(screen.getByRole('menu')).toBeInTheDocument();

        await user.keyboard('{Escape}');
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
        expect(trigger).toHaveFocus();
    });

    it('marks the current language as checked when opened', async () => {
        const user = userEvent.setup();

        render(<LanguageMenu language="en" onLanguageChange={() => {}} />);

        await user.click(
            screen.getByRole('button', { name: /choose language/i }),
        );

        expect(
            screen.getByRole('menuitemradio', { name: /english/i }),
        ).toHaveAttribute('aria-checked', 'true');
        expect(
            screen.getByRole('menuitemradio', { name: /português/i }),
        ).toHaveAttribute('aria-checked', 'false');
    });

    it('shows the flag image for the current language on the trigger', () => {
        render(<LanguageMenu language="pt-BR" onLanguageChange={() => {}} />);

        const flag = screen
            .getByRole('button', {
                name: /escolher idioma/i,
            })
            .querySelector('img');

        expect(flag).not.toBeNull();
        expect(flag?.getAttribute('src')).toContain('br');
    });
});

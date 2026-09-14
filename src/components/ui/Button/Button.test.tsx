import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import Button from './Button';

describe('Button', () => {
    it('renders as a button by default', () => {
        render(<Button>Start a conversation</Button>);

        const button = screen.getByRole('button', {
            name: 'Start a conversation',
        });

        expect(button.tagName).toBe('BUTTON');
        expect(button).toHaveAttribute('type', 'button');
    });

    it('renders as a link when href is provided', () => {
        render(
            <Button href="mailto:mail@matuz.me">Start a conversation</Button>,
        );

        const link = screen.getByRole('link', {
            name: 'Start a conversation',
        });

        expect(link.tagName).toBe('A');
        expect(link).toHaveAttribute('href', 'mailto:mail@matuz.me');
        expect(
            screen.queryByRole('button', { name: 'Start a conversation' }),
        ).not.toBeInTheDocument();
    });

    it('applies the accent color styles by default', () => {
        render(<Button>Click</Button>);

        expect(screen.getByRole('button')).toHaveClass('bg-accent');
    });

    it.each(['accent', 'primary', 'outline'] as const)(
        'applies %s color styles',
        (color) => {
            render(<Button color={color}>Click</Button>);

            const button = screen.getByRole('button');

            expect(button.className).toContain(
                {
                    accent: 'bg-accent',
                    primary: 'bg-primary',
                    outline: 'border',
                }[color],
            );
        },
    );

    it('appends a custom className', () => {
        render(<Button className="mt-8">Click</Button>);

        expect(screen.getByRole('button')).toHaveClass('mt-8');
    });

    it('shows a loading spinner and disables interaction while loading', async () => {
        const onClick = vi.fn();
        const user = userEvent.setup();

        render(
            <Button loading onClick={onClick}>
                Click
            </Button>,
        );

        const button = screen.getByRole('button');

        expect(button).toBeDisabled();
        await user.click(button);
        expect(onClick).not.toHaveBeenCalled();
    });

    it('respects the disabled prop', async () => {
        const onClick = vi.fn();
        const user = userEvent.setup();

        render(
            <Button disabled onClick={onClick}>
                Click
            </Button>,
        );

        await user.click(screen.getByRole('button'));
        expect(onClick).not.toHaveBeenCalled();
    });

    it('fires onClick when enabled', async () => {
        const onClick = vi.fn();
        const user = userEvent.setup();

        render(<Button onClick={onClick}>Click</Button>);

        await user.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('allows overriding the button type for form submissions', () => {
        render(<Button type="submit">Submit</Button>);

        expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('keeps the group class so child arrows can react to hover', () => {
        render(<Button>Click</Button>);

        expect(screen.getByRole('button')).toHaveClass('group');
    });
});

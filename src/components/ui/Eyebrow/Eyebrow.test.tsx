import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Eyebrow from './Eyebrow';

describe('Eyebrow', () => {
    it('renders its text', () => {
        render(<Eyebrow>What I do</Eyebrow>);

        expect(screen.getByText('What I do')).toBeInTheDocument();
    });

    it('defaults to the primary color', () => {
        const { container } = render(<Eyebrow>Label</Eyebrow>);

        expect(container.querySelector('p')).toHaveClass('text-primary');
    });

    it.each([
        ['secondary', 'text-secondary'],
        ['accent', 'text-accent'],
        ['warning', 'text-warning'],
        ['success', 'text-success'],
        ['highlight', 'text-highlight'],
        ['primary', 'text-primary'],
    ] as const)('applies the %s color', (color, expectedClass) => {
        const { container } = render(<Eyebrow color={color}>Label</Eyebrow>);

        expect(container.querySelector('p')).toHaveClass(expectedClass);
    });

    it('hides the decorative line by default', () => {
        const { container } = render(<Eyebrow>Label</Eyebrow>);

        expect(container.querySelector('span[aria-hidden]')).toBeNull();
    });

    it('renders a decorative line when requested', () => {
        const { container } = render(<Eyebrow line>Label</Eyebrow>);

        const line = container.querySelector('span[aria-hidden]');

        expect(line).not.toBeNull();
        expect(line).toHaveClass('h-px');
    });

    it('renders as an inline flex row so the line sits beside the text', () => {
        const { container } = render(<Eyebrow line>Label</Eyebrow>);

        expect(container.querySelector('p')).toHaveClass('inline-flex');
    });
});

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Container from './Container';

describe('Container', () => {
    it('renders its children', () => {
        const { container } = render(
            <Container>
                <p>Hello</p>
            </Container>,
        );

        expect(container.querySelector('p')?.textContent).toBe('Hello');
    });

    it('renders as a div with the standard width and gutter classes', () => {
        const { container } = render(<Container>Content</Container>);

        const div = container.firstElementChild as HTMLElement;

        expect(div.tagName).toBe('DIV');
        expect(div).toHaveClass('mx-auto');
        expect(div).toHaveClass('max-w-7xl');
        expect(div).toHaveClass('px-5');
        expect(div).toHaveClass('sm:px-8');
        expect(div).toHaveClass('lg:px-10');
    });

    it('merges custom classes with the defaults', () => {
        const { container } = render(
            <Container className="py-20">Content</Container>,
        );

        const div = container.firstElementChild as HTMLElement;

        expect(div).toHaveClass('py-20');
        expect(div).toHaveClass('max-w-7xl');
    });

    it('forwards extra props like id and data attributes', () => {
        const { container } = render(
            <Container id="hero" data-testid="container">
                Content
            </Container>,
        );

        const div = container.firstElementChild as HTMLElement;

        expect(div).toHaveAttribute('id', 'hero');
        expect(div).toHaveAttribute('data-testid', 'container');
    });
});

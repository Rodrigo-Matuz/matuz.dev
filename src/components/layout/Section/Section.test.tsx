import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Section from './Section';

describe('Section', () => {
    it('renders as a section element with children', () => {
        const { container } = render(
            <Section>
                <h2>Title</h2>
            </Section>,
        );

        const section = container.firstElementChild as HTMLElement;

        expect(section.tagName).toBe('SECTION');
        expect(section.querySelector('h2')?.textContent).toBe('Title');
    });

    it('has no band background by default', () => {
        const { container } = render(<Section>Content</Section>);

        const section = container.firstElementChild as HTMLElement;

        expect(section).not.toHaveClass('bg-background/75');
        expect(section).not.toHaveClass('bg-background/40');
    });

    it('applies the solid band treatment when band is true', () => {
        const { container } = render(<Section band>Content</Section>);

        const section = container.firstElementChild as HTMLElement;

        expect(section).toHaveClass('bg-background/75');
        expect(section).toHaveClass('backdrop-blur-md');
        expect(section).toHaveClass('border-y');
    });

    it('applies the soft band treatment when band is "soft"', () => {
        const { container } = render(<Section band="soft">Content</Section>);

        const section = container.firstElementChild as HTMLElement;

        expect(section).toHaveClass('bg-background/40');
        expect(section).toHaveClass('backdrop-blur-md');
    });

    it('forwards the id for anchor navigation', () => {
        const { container } = render(<Section id="record">Content</Section>);

        expect(container.firstElementChild).toHaveAttribute('id', 'record');
    });

    it('merges custom classes with the band classes', () => {
        const { container } = render(
            <Section band className="extra-class">Content</Section>,
        );

        const section = container.firstElementChild as HTMLElement;

        expect(section).toHaveClass('extra-class');
        expect(section).toHaveClass('bg-background/75');
    });
});

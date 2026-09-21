import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import SectionHeading from './SectionHeading';

describe('SectionHeading', () => {
    it('renders the title as an h2', () => {
        render(<SectionHeading title="A little bit of everything." />);

        const heading = screen.getByRole('heading', { level: 2 });

        expect(heading).toHaveTextContent('A little bit of everything.');
    });

    it('renders the eyebrow before the title', () => {
        render(
            <SectionHeading
                eyebrow={<span data-testid="eyebrow">Experience</span>}
                title="Title"
            />,
        );

        const heading = screen.getByRole('heading', { level: 2 });

        expect(heading.previousElementSibling).toHaveAttribute(
            'data-testid',
            'eyebrow',
        );
    });

    it('renders the description when provided', () => {
        render(
            <SectionHeading
                title="Title"
                description="Professional experience."
            />,
        );

        expect(
            screen.getByText('Professional experience.'),
        ).toBeInTheDocument();
    });

    it('omits the description element when not provided', () => {
        const { container } = render(<SectionHeading title="Title" />);

        expect(container.querySelector('p')).toBeNull();
    });

    it('renders the action below the description in stacked layout', () => {
        render(
            <SectionHeading
                title="Title"
                description="Description text."
                action={<a href="#x">View experience</a>}
            />,
        );

        const description = screen.getByText('Description text.');
        const action = screen.getByRole('link', { name: 'View experience' });

        expect(description.nextElementSibling).toContainElement(action);
    });

    describe('split layout', () => {
        it('renders the title on the left and children on the right', () => {
            render(
                <SectionHeading layout="split" title="Title">
                    <ol data-testid="list">
                        <li>Item</li>
                    </ol>
                </SectionHeading>,
            );

            const heading = screen.getByRole('heading', { level: 2 });
            const list = screen.getByTestId('list');
            const leftColumn = heading.parentElement as HTMLElement;
            const rightColumn = list.parentElement as HTMLElement;

            expect(leftColumn).not.toBe(rightColumn);
            expect(leftColumn).not.toContainElement(list);
            expect(rightColumn).toContainElement(list);
        });

        it('keeps description under the title on the left column', () => {
            render(
                <SectionHeading
                    layout="split"
                    title="Title"
                    description="Left side text."
                >
                    <p>Right side</p>
                </SectionHeading>,
            );

            const heading = screen.getByRole('heading', { level: 2 });
            const leftColumn = heading.parentElement as HTMLElement;

            expect(leftColumn).toHaveTextContent('Left side text.');
            expect(leftColumn).not.toHaveTextContent('Right side');
        });

        it('renders the action in the left column', () => {
            render(
                <SectionHeading
                    layout="split"
                    title="Title"
                    action={<a href="#x">Action link</a>}
                >
                    <p>Right side</p>
                </SectionHeading>,
            );

            const heading = screen.getByRole('heading', { level: 2 });
            const leftColumn = heading.parentElement as HTMLElement;

            expect(leftColumn).toContainElement(
                screen.getByRole('link', { name: 'Action link' }),
            );
        });

        it('uses the two-column grid on large screens', () => {
            const { container } = render(
                <SectionHeading layout="split" title="Title">
                    <p>Right side</p>
                </SectionHeading>,
            );

            const grid = container.firstElementChild as HTMLElement;

            expect(grid).toHaveClass('lg:grid-cols-[0.8fr_1.6fr]');
        });
    });
});

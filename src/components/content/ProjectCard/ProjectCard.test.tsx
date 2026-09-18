import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ProjectCard from './ProjectCard';

const baseProps = {
    title: 'Wallpaper Picker UI',
    description: 'A cross-platform desktop wallpaper application.',
};

describe('ProjectCard', () => {
    it('renders the title and description', () => {
        render(<ProjectCard {...baseProps} />);

        expect(
            screen.getByRole('heading', { name: baseProps.title }),
        ).toBeInTheDocument();
        expect(screen.getByText(baseProps.description)).toBeInTheDocument();
    });

    it('renders technology tags as a list', () => {
        render(
            <ProjectCard
                {...baseProps}
                technologies={['Rust', 'Tauri', 'FFmpeg']}
            />,
        );

        const list = screen.getByRole('list', { name: baseProps.title });

        expect(list).toBeInTheDocument();

        for (const technology of ['Rust', 'Tauri', 'FFmpeg']) {
            expect(screen.getByText(technology)).toBeInTheDocument();
        }
    });

    it('omits the technology list when none are given', () => {
        render(<ProjectCard {...baseProps} />);

        expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it('links the source to GitHub with a localized label', () => {
        render(
            <ProjectCard
                {...baseProps}
                github="https://github.com/Rodrigo-Matuz"
                sourceLabel="Código"
            />,
        );

        // The footer label link; the title also links to the source (next test).
        const source = screen.getAllByRole('link', { name: /código/i })[0];

        expect(source).toHaveAttribute(
            'href',
            'https://github.com/Rodrigo-Matuz',
        );
        expect(source).toHaveAttribute('target', '_blank');
    });

    it('makes the title a link to the source', () => {
        render(
            <ProjectCard
                {...baseProps}
                github="https://github.com/Rodrigo-Matuz"
                sourceLabel="Código"
            />,
        );

        // The title link's accessible name combines the title and the label.
        const titleLink = screen.getByRole('link', {
            name: new RegExp(`${baseProps.title}.*código`, 'i'),
        });

        expect(titleLink).toHaveAttribute(
            'href',
            'https://github.com/Rodrigo-Matuz',
        );
        expect(titleLink).toHaveAttribute('target', '_blank');
        expect(titleLink).toHaveTextContent(baseProps.title);
    });

    it('keeps the title as plain heading without a source link', () => {
        render(<ProjectCard {...baseProps} />);

        expect(
            screen.getByRole('heading', { name: baseProps.title }),
        ).toBeInTheDocument();
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('highlights the card with the primary color on hover', () => {
        const { container } = render(<ProjectCard {...baseProps} />);

        const card = container.firstElementChild as HTMLElement;

        expect(card).toHaveClass('hover:border-primary/30');
        expect(card).toHaveClass('hover:bg-surface-raised');
    });

    it('opens external preview links in a new tab', () => {
        render(
            <ProjectCard
                {...baseProps}
                preview="https://example.com"
                previewLabel="Prévia"
            />,
        );

        const preview = screen.getByRole('link', { name: /prévia/i });

        expect(preview).toHaveAttribute('href', 'https://example.com');
        expect(preview).toHaveAttribute('target', '_blank');
    });

    it('keeps internal preview links in the same tab', () => {
        render(<ProjectCard {...baseProps} preview="/" />);

        const preview = screen.getByRole('link', { name: /preview/i });

        expect(preview).toHaveAttribute('href', '/');
        expect(preview).not.toHaveAttribute('target');
    });

    it('renders no links without github or preview', () => {
        render(<ProjectCard {...baseProps} />);

        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('renders the optional image as a decorative band', () => {
        render(<ProjectCard {...baseProps} image="/preview.webp" />);

        const image = screen.getByAltText('');

        expect(image).toHaveAttribute('src', '/preview.webp');

        // The image sits in a dedicated band above the card body.
        const band = image.closest('div');

        expect(band).toHaveClass('overflow-hidden');
        expect(band).toHaveClass('border-b');
    });
});

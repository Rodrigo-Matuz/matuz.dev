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

        const source = screen.getByRole('link', { name: /código/i });

        expect(source).toHaveAttribute(
            'href',
            'https://github.com/Rodrigo-Matuz',
        );
        expect(source).toHaveAttribute('target', '_blank');
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

    it('renders the optional image as a decorative backdrop', () => {
        render(<ProjectCard {...baseProps} image="/preview.webp" />);

        const image = screen.getByAltText('');

        expect(image).toHaveAttribute('src', '/preview.webp');
        expect(image.closest('div')).toHaveClass('pointer-events-none');
    });
});

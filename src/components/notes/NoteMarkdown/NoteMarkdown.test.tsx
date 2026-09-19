import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { NoteMarkdown } from './NoteMarkdown';

describe('NoteMarkdown', () => {
    it('renders headings and paragraphs', () => {
        render(<NoteMarkdown content={'# Title\n\nSome text.'} />);

        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Title');
        expect(screen.getByText('Some text.')).toBeInTheDocument();
    });

    it('renders GFM tables', () => {
        const table = '| a | b |\n| - | - |\n| 1 | 2 |';

        render(<NoteMarkdown content={table} />);

        expect(screen.getByRole('table')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('renders task lists', () => {
        render(<NoteMarkdown content={'- [x] done\n- [ ] todo'} />);

        expect(screen.getByRole('checkbox', { checked: true })).toBeInTheDocument();
        expect(screen.getByRole('checkbox', { checked: false })).toBeInTheDocument();
    });

    it('highlights code blocks', () => {
        render(<NoteMarkdown content={'```ts\nconst x = 1;\n```'} />);

        // rehype-highlight splits the code into hljs-* spans; assert on the
        // highlighted token classes rather than raw text.
        expect(document.querySelector('.hljs-keyword')).toHaveTextContent('const');
        expect(document.querySelector('.hljs-number')).toHaveTextContent('1');
    });

    it('opens external links in a new tab', () => {
        render(<NoteMarkdown content={'[site](https://example.com)'} />);

        const link = screen.getByRole('link', { name: 'site' });

        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noreferrer');
    });
});

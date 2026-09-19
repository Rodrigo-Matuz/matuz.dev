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

describe('NoteMarkdown — callouts', () => {
    it('renders a note callout with icon and title', () => {
        render(
            <NoteMarkdown
                content={'> [!note] Note Callout\n> A standard note callout.'}
            />,
        );

        expect(screen.getByText('Note Callout')).toBeInTheDocument();
        expect(screen.getByText('A standard note callout.')).toBeInTheDocument();
    });

    it('renders a warning callout with its own color class', () => {
        render(
            <NoteMarkdown content={'> [!warning] Warning Callout\n> Be careful.'} />,
        );

        const panel = screen.getByText('Warning Callout').closest('div');

        expect(panel?.className).toContain('border-warning');
    });

    it('renders a collapsible tip callout collapsed by default', () => {
        render(
            <NoteMarkdown content={'> [!tip]- Collapsible Tip\n> Hidden body.'} />,
        );

        // Title appears in both <summary> and the data attribute.
        const details = screen
            .getAllByText('Collapsible Tip')
            .map((el) => el.closest('details'))
            .find(Boolean);

        expect(details).toBeInTheDocument();
        expect(details).not.toHaveAttribute('open');
    });

    it('renders an expanded danger callout open by default', () => {
        render(
            <NoteMarkdown content={'> [!danger]+ Expanded Danger\n> Visible body.'} />,
        );

        const details = screen
            .getAllByText('Expanded Danger')
            .map((el) => el.closest('details'))
            .find(Boolean);

        expect(details).toHaveAttribute('open');
    });
});

describe('NoteMarkdown — comments', () => {
    it('strips %% comments %% from the output', () => {
        render(
            <NoteMarkdown content={'Visible text\n%% hidden comment %%\nMore text'} />,
        );

        expect(screen.getByText(/Visible text/)).toBeInTheDocument();
        expect(screen.queryByText(/hidden comment/)).not.toBeInTheDocument();
    });
});

describe('NoteMarkdown — math', () => {
    it('renders inline LaTeX via KaTeX', () => {
        render(<NoteMarkdown content={'Inline: $E = mc^2$'} />);

        expect(document.querySelector('.katex')).toBeInTheDocument();
    });

    it('renders block LaTeX via KaTeX', () => {
        // Block math needs surrounding blank lines, as it appears in real notes.
        const content = [
            'Some intro text.',
            '',
            '$$',
            '\\int_{-\\infty}^{\\infty} e^{-x^2} \\, dx = \\sqrt{\\pi}',
            '$$',
            '',
            'Some outro text.',
        ].join('\n');

        render(<NoteMarkdown content={content} />);

        expect(document.querySelector('.katex-display')).toBeInTheDocument();
    });
});

describe('NoteMarkdown — definition lists', () => {
    it('renders definition lists', () => {
        render(<NoteMarkdown content={'Term\n: Definition text'} />);

        expect(screen.getByText('Term')).toBeInTheDocument();
        expect(screen.getByText('Definition text')).toBeInTheDocument();
    });
});

describe('NoteMarkdown — inline HTML', () => {
    it('renders raw inline HTML', () => {
        render(<NoteMarkdown content={'Text with <mark>highlighted</mark> part'} />);

        expect(screen.getByText('highlighted').tagName).toBe('MARK');
    });
});

describe('NoteMarkdown — footnotes', () => {
    it('renders footnotes', () => {
        render(
            <NoteMarkdown
                content={'Text with a footnote[^1].\n\n[^1]: The footnote body.'}
            />,
        );

        expect(screen.getByText('The footnote body.')).toBeInTheDocument();
    });
});

describe('NoteMarkdown — emphasis colors', () => {
    it('renders bold in blue (primary)', () => {
        render(<NoteMarkdown content={'**Bold text**'} />);

        expect(screen.getByText('Bold text').className).toContain('text-primary');
    });

    it('renders italic as muted, not highlighted', () => {
        render(<NoteMarkdown content={'*italicized text*'} />);

        const em = screen.getByText('italicized text');

        expect(em.className).toContain('text-muted');
        expect(em.className).not.toContain('text-highlight');
    });

    it('renders inline code in blue (primary)', () => {
        render(<NoteMarkdown content={'Use `inline code` here'} />);

        expect(screen.getByText('inline code').className).toContain('text-primary');
    });
});

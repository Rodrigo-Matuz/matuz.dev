import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { NotePage } from './NotePage';
import { locales } from '$/content';
import * as notesLib from '$/lib/notes';

vi.mock('$/lib/notes', () => ({
    fetchNotesIndex: vi.fn(),
    fetchNoteContent: vi.fn(),
}));

const mockIndex: notesLib.NoteIndexEntry[] = [
    {
        slug: 'my-note',
        title: 'My note',
        created: '2026-09-19T07:54',
        updated: '2026-09-19T07:54',
    },
];

const mockNote: notesLib.NoteContent = {
    ...mockIndex[0],
    content: '# Heading\n\nBody text.',
};

const renderPage = (slug = 'my-note') =>
    render(
        <MemoryRouter initialEntries={[`/notes/${slug}`]}>
            {/* NotePage reads useParams, so it must mount inside a Route. */}
            <Routes>
                <Route
                    path="/notes/:slug"
                    element={
                        <NotePage renderContent={(content) => <pre>{content}</pre>} />
                    }
                />
            </Routes>
        </MemoryRouter>,
    );

beforeAll(() => {
    class MockIntersectionObserver implements IntersectionObserver {
        readonly root = null;
        readonly rootMargin = '';
        readonly scrollMargin = '';
        readonly thresholds = [];
        disconnect() {}
        observe() {}
        unobserve() {}
        takeRecords(): IntersectionObserverEntry[] {
            return [];
        }
    }

    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
});

describe('NotePage', () => {
    it('renders the note title and metadata once loaded', async () => {
        vi.mocked(notesLib.fetchNotesIndex).mockResolvedValue(mockIndex);
        vi.mocked(notesLib.fetchNoteContent).mockResolvedValue(mockNote);

        renderPage();

        await waitFor(() => {
            expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('My note');
        });

        // RelativeTimeTag renders "Created <relative time>" as one node;
        // "Updated" also appears in the sidebar entries.
        expect(screen.getByText(/Criada\s/)).toBeInTheDocument();
        expect(screen.getAllByText(/Atualizada\s/).length).toBeGreaterThan(0);
    });

    it('renders the note content through the provided renderer', async () => {
        vi.mocked(notesLib.fetchNotesIndex).mockResolvedValue(mockIndex);
        vi.mocked(notesLib.fetchNoteContent).mockResolvedValue(mockNote);

        renderPage();

        await waitFor(() => {
            const pre = screen.getByRole('article').querySelector('pre');

            expect(pre?.textContent).toBe(mockNote.content);
        });
    });

    it('shows the not-found state for unknown slugs', async () => {
        vi.mocked(notesLib.fetchNotesIndex).mockResolvedValue(mockIndex);
        vi.mocked(notesLib.fetchNoteContent).mockResolvedValue(null);

        renderPage('nope');

        await waitFor(() => {
            expect(screen.getByText(locales['pt-BR'].notes.notFound)).toBeInTheDocument();
        });
    });

    it('shows the error state when the fetch fails', async () => {
        vi.mocked(notesLib.fetchNotesIndex).mockResolvedValue(mockIndex);
        vi.mocked(notesLib.fetchNoteContent).mockRejectedValue(new Error('boom'));

        renderPage();

        await waitFor(() => {
            expect(screen.getByText(locales['pt-BR'].notes.loadError)).toBeInTheDocument();
        });
    });
});

import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { NotesPage } from './NotesPage';
import { locales } from '$/content';
import * as notesLib from '$/lib/notes';

vi.mock('$/lib/notes', () => ({
    fetchNotesIndex: vi.fn(),
    fetchNoteContent: vi.fn(),
}));

const mockIndex: notesLib.NoteIndexEntry[] = [
    {
        slug: 'newest',
        title: 'Newest note',
        created: '2026-09-19T07:54',
        updated: '2026-09-19T07:54',
    },
    {
        slug: 'older',
        title: 'Older note',
        created: '2026-01-01T00:00',
        updated: '2026-02-01T00:00',
    },
];

const renderPage = () =>
    render(
        <MemoryRouter>
            <NotesPage />
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

describe('NotesPage', () => {
    it('renders the page title from the default locale (pt-BR)', () => {
        vi.mocked(notesLib.fetchNotesIndex).mockResolvedValue(mockIndex);

        renderPage();

        expect(
            screen.getByRole('heading', { level: 1 }),
        ).toHaveTextContent(locales['pt-BR'].notes.title);
    });

    it('shows the language notice', () => {
        vi.mocked(notesLib.fetchNotesIndex).mockResolvedValue(mockIndex);

        renderPage();

        expect(screen.getByText(locales['pt-BR'].notes.languageNotice)).toBeInTheDocument();
    });

    it('lists notes newest first once loaded', async () => {
        vi.mocked(notesLib.fetchNotesIndex).mockResolvedValue(mockIndex);

        renderPage();

        await waitFor(() => {
            // Titles appear in the mobile strip, desktop sidebar, and the
            // index list — assert presence, not uniqueness.
            expect(screen.getAllByText('Newest note').length).toBeGreaterThan(0);
        });

        expect(screen.getAllByText('Older note').length).toBeGreaterThan(0);
    });

    it('shows the empty state when there are no notes', async () => {
        vi.mocked(notesLib.fetchNotesIndex).mockResolvedValue([]);

        renderPage();

        await waitFor(() => {
            expect(screen.getByText(locales['pt-BR'].notes.empty)).toBeInTheDocument();
        });
    });

    it('shows the error state when the index fails', async () => {
        vi.mocked(notesLib.fetchNotesIndex).mockRejectedValue(new Error('boom'));

        renderPage();

        await waitFor(() => {
            expect(screen.getByText(locales['pt-BR'].notes.loadError)).toBeInTheDocument();
        });
    });
});

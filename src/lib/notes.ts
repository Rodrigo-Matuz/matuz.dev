/**
 * Client-side access to the notes API (`/api/notes*`).
 *
 * The browser never sees the GitHub token — it only talks to our own origin.
 * Fetched notes are cached in memory for the session (stale-while-revalidate
 * semantics are enough for v1; no service worker).
 */

export interface NoteIndexEntry {
    slug: string;
    title: string;
    created: string | null;
    updated: string | null;
}

export interface NoteContent extends NoteIndexEntry {
    content: string;
}

const indexCache: { value: NoteIndexEntry[] | null; promise: Promise<NoteIndexEntry[]> | null } = {
    value: null,
    promise: null,
};

const contentCache = new Map<string, NoteContent>();

/** Fetch the note index (newest first). Cached for the session. */
export async function fetchNotesIndex(): Promise<NoteIndexEntry[]> {
    if (indexCache.value) return indexCache.value;

    if (!indexCache.promise) {
        indexCache.promise = fetch('/api/notes')
            .then(async (response) => {
                if (!response.ok) throw new Error(`Notes index failed (${response.status})`);

                const data = (await response.json()) as { notes: NoteIndexEntry[] };

                indexCache.value = data.notes;

                return data.notes;
            })
            .finally(() => {
                indexCache.promise = null;
            });
    }

    return indexCache.promise;
}

/** Fetch a single note's content. Cached for the session. */
export async function fetchNoteContent(slug: string): Promise<NoteContent | null> {
    const cached = contentCache.get(slug);

    if (cached) return cached;

    const response = await fetch(`/api/notes/${encodeURIComponent(slug)}`);

    if (response.status === 404) return null;

    if (!response.ok) throw new Error(`Note fetch failed (${response.status})`);

    const note = (await response.json()) as NoteContent;

    contentCache.set(slug, note);

    return note;
}

/** Test helper: clear the session caches. */
export function clearNotesSessionCache(): void {
    indexCache.value = null;
    indexCache.promise = null;
    contentCache.clear();
}

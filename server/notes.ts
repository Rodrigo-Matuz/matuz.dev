/**
 * GitHub-backed notes store: lists the tracked folder in the private Obsidian
 * repo, parses note headers, and caches everything in memory with ETag
 * revalidation so reader traffic never burns the token's rate limit.
 *
 * Configuration comes from the environment:
 *   NOTES_GITHUB_TOKEN — fine-grained PAT (Contents: Read, vault repo only)
 *   NOTES_REPO         — "owner/repo" of the vault
 *   NOTES_PATH         — tracked folder inside the vault (default: blog)
 */

import crypto from 'node:crypto';

import {
    deriveTitle,
    parseNoteHeader,
    sortNotes,
    stripNoteHeader,
    type NoteMeta,
} from './notes-meta.js';

export type NoteIndexEntry = NoteMeta;

export interface NoteContent extends NoteMeta {
    content: string;
}

const GITHUB_API = 'https://api.github.com';

const config = {
    get token() {
        return process.env.NOTES_GITHUB_TOKEN ?? '';
    },
    get repo() {
        return process.env.NOTES_REPO ?? '';
    },
    get path() {
        return process.env.NOTES_PATH ?? 'blog';
    },
};

export function isNotesConfigured(): boolean {
    return config.token !== '' && config.repo !== '';
}

/** Convert a repo path under NOTES_PATH into a URL slug (no .md, no leading /). */
function pathToSlug(path: string): string {
    const withoutBase = path.startsWith(`${config.path}/`)
        ? path.slice(config.path.length + 1)
        : path;

    return withoutBase.replace(/\.md$/i, '').replace(/\\/g, '/');
}

/**
 * Short stable ID derived from the repo path (first 8 hex chars of the
 * SHA-256). Used as a collision-proof alias: two notes with the same
 * filename in different folders get different IDs, and renaming a note's
 * title keeps the ID stable as long as the path is unchanged.
 */
function shortId(path: string): string {
    return crypto.createHash('sha256').update(path).digest('hex').slice(0, 8);
}

interface CacheEntry<T> {
    value: T;
    etag: string | null;
    fetchedAt: number;
}

const indexCache: { entry: CacheEntry<NoteIndexEntry[]> | null } = {
    entry: null,
};
const contentCaches = new Map<string, CacheEntry<NoteContent>>();

/** Re-fetch interval for the index even when ETags match (ms): 5 minutes. */
const INDEX_TTL = 5 * 60 * 1000;

interface GithubContentsItem {
    path: string;
    type: 'file' | 'dir';
    sha: string;
}

interface GithubContentsResponse {
    sha: string;
    content?: string;
    encoding?: string;
}

function githubHeaders(etag: string | null): Record<string, string> {
    const headers: Record<string, string> = {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
    };

    if (config.token) headers.Authorization = `Bearer ${config.token}`;
    if (etag) headers['If-None-Match'] = etag;

    return headers;
}

async function githubGet(
    url: string,
    etag: string | null,
): Promise<{ status: number; data: unknown; etag: string | null }> {
    const response = await fetch(url, { headers: githubHeaders(etag) });
    const data = response.status === 304 ? null : await response.json();

    return {
        status: response.status,
        data,
        etag: response.headers.get('etag'),
    };
}

/** Recursively list .md files under the tracked folder. */
async function listMarkdownFiles(
    dir: string,
): Promise<{ files: string[]; etag: string | null }> {
    const url = `${GITHUB_API}/repos/${config.repo}/contents/${dir}`;
    const { status, data, etag } = await githubGet(url, null);

    if (status === 404) return { files: [], etag: null };

    if (status !== 200 || !Array.isArray(data)) {
        throw new Error(`GitHub listing failed for ${dir} (status ${status})`);
    }

    const items = data as GithubContentsItem[];
    const files: string[] = [];

    for (const item of items) {
        if (item.type === 'file' && item.path.toLowerCase().endsWith('.md')) {
            files.push(item.path);
        } else if (item.type === 'dir') {
            // Nested folders are flattened into the chronological list.
            const nested = await listMarkdownFiles(item.path);

            files.push(...nested.files);
        }
    }

    return { files, etag };
}

/** Fetch one raw file's content via the Contents API. */
async function fetchFile(
    path: string,
    etag: string | null,
): Promise<{ raw: string; etag: string | null } | null> {
    const url = `${GITHUB_API}/repos/${config.repo}/contents/${path}`;
    const { status, data, etag: newEtag } = await githubGet(url, etag);

    if (status === 404) return null;

    if (status === 304) return { raw: '', etag }; // caller keeps cached value

    if (status !== 200 || typeof data !== 'object' || data === null) {
        throw new Error(`GitHub fetch failed for ${path} (status ${status})`);
    }

    const payload = data as GithubContentsResponse;

    if (payload.encoding !== 'base64' || typeof payload.content !== 'string') {
        throw new Error(`Unexpected encoding for ${path}`);
    }

    return {
        raw: Buffer.from(payload.content, 'base64').toString('utf-8'),
        etag: newEtag,
    };
}

/**
 * Get the note index (metadata only, newest first). Cached in memory and
 * revalidated with ETags; a full refresh happens at most every INDEX_TTL.
 */
export async function getNotesIndex(): Promise<NoteIndexEntry[]> {
    const cached = indexCache.entry;
    const fresh = cached !== null && Date.now() - cached.fetchedAt < INDEX_TTL;

    if (cached && fresh) return cached.value;

    const { files } = await listMarkdownFiles(config.path);
    const entries: NoteIndexEntry[] = [];

    for (const path of files) {
        const result = await fetchFile(path, null);

        if (!result) continue;

        const { raw } = result;
        const header = parseNoteHeader(raw);
        const filename = path.split('/').pop() ?? path;

        entries.push({
            slug: pathToSlug(path),
            id: shortId(path),
            title: deriveTitle(raw, filename),
            created: header.created,
            updated: header.updated,
        });
    }

    const sorted = sortNotes(entries);

    indexCache.entry = { value: sorted, etag: null, fetchedAt: Date.now() };

    return sorted;
}

/**
 * Get one note's full content (header stripped). Accepts either the full
 * slug (`user1/FileNameTitle`) or the note's short ID (`a1b2c3d4`) — the ID
 * keeps URLs collision-proof when two notes share a filename. Throws when
 * the identifier is not in the index — callers must validate against the
 * listing, never build API paths from raw user input.
 */
export async function getNoteContent(
    identifier: string,
): Promise<NoteContent | null> {
    const index = await getNotesIndex();
    const meta =
        index.find((entry) => entry.slug === identifier) ??
        index.find((entry) => entry.id === identifier);

    if (!meta) return null;

    const slug = meta.slug;
    const cached = contentCaches.get(slug);
    const path = `${config.path}/${slug}.md`;

    if (cached) {
        const revalidated = await fetchFile(path, cached.etag);

        if (revalidated && revalidated.raw === '') {
            return cached.value; // 304 — still current
        }
    }

    const result = await fetchFile(path, null);

    if (!result) return null;

    const header = parseNoteHeader(result.raw);
    const note: NoteContent = {
        ...meta,
        created: header.created ?? meta.created,
        updated: header.updated ?? meta.updated,
        content: stripNoteHeader(result.raw),
    };

    contentCaches.set(slug, {
        value: note,
        etag: result.etag,
        fetchedAt: Date.now(),
    });

    return note;
}

/** Test helper: clear all in-memory caches. */
export function clearNotesCaches(): void {
    indexCache.entry = null;
    contentCaches.clear();
}

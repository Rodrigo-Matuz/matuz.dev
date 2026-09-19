/**
 * Notes metadata parsing and sorting.
 *
 * Every note starts with a three-line header block (fenced with ``` on the
 * first and fourth lines — see docs/phase4plan.md §1):
 *
 * ```
 * created: 2026-09-19T07:54
 * updated: 2026-09-19T07:54
 * ```
 *
 * `created` is the ordering key (never changes); `updated` feeds the relative
 * "last updated" tag. Parsing is defensive: malformed notes never crash the
 * index — they sort last and lose their tags.
 */

export interface NoteMeta {
    slug: string;
    title: string;
    /** ISO-ish local timestamp `YYYY-MM-DDTHH:mm`, or null when missing. */
    created: string | null;
    updated: string | null;
}

/** Matches the fenced header block at the very start of a note. */
const HEADER_BLOCK = /^```(?:[a-z]*)\ncreated:\s*(\S+)\nupdated:\s*(\S+)\n```/;

/** Matches a YAML frontmatter block (--- fenced) with created/updated lines. */
const FRONTMATTER_BLOCK = /^---\n([\s\S]*?)\n---/;

/** Matches `created:` / `updated:` lines without the fence (tolerant fallback). */
const HEADER_LINE = /^(created|updated):\s*(\S+)\s*$/;

/** Valid timestamp shape: `YYYY-MM-DDTHH:mm`. */
const TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

/**
 * Extract the header metadata from raw note content.
 * Returns null values when the header is missing or malformed.
 */
export function parseNoteHeader(
    raw: string,
): { created: string | null; updated: string | null } {
    const firstBlock = raw.match(HEADER_BLOCK);

    if (firstBlock) {
        return { created: firstBlock[1], updated: firstBlock[2] };
    }

    // YAML frontmatter variant: scan the block for created/updated lines.
    const frontmatter = raw.match(FRONTMATTER_BLOCK);

    if (frontmatter) {
        let created: string | null = null;
        let updated: string | null = null;

        for (const line of frontmatter[1].split('\n')) {
            const match = line.match(HEADER_LINE);

            if (!match) continue;

            const value = TIMESTAMP.test(match[2]) ? match[2] : null;

            if (match[1] === 'created') created = value;
            else updated = value;
        }

        if (created !== null || updated !== null) {
            return { created, updated };
        }
    }

    // Tolerant fallback: unfenced created/updated lines at the top.
    const lines = raw.split('\n');
    let created: string | null = null;
    let updated: string | null = null;

    for (const line of lines.slice(0, 4)) {
        const match = line.match(HEADER_LINE);

        if (match) {
            const value = TIMESTAMP.test(match[2]) ? match[2] : null;

            if (match[1] === 'created') created = value;
            else updated = value;
        } else if (line.trim() !== '' && created !== null) {
            break; // past the header
        }
    }

    return { created, updated };
}

/**
 * Strip the header block (or loose header lines) from raw content so only
 * the Markdown body is rendered.
 */
export function stripNoteHeader(raw: string): string {
    const withoutBlock = raw.replace(HEADER_BLOCK, '').replace(/^\s+/, '');

    if (withoutBlock !== raw) return withoutBlock;

    // YAML frontmatter variant: strip the whole --- block.
    const withoutFrontmatter = raw
        .replace(FRONTMATTER_BLOCK, '')
        .replace(/^\s+/, '');

    if (withoutFrontmatter !== raw) return withoutFrontmatter;

    const lines = raw.split('\n');
    let index = 0;

    while (index < lines.length) {
        const match = lines[index].match(HEADER_LINE);

        if (match) {
            index += 1;
        } else if (lines[index].trim() === '' && index < 4) {
            index += 1;
        } else {
            break;
        }
    }

    return lines.slice(index).join('\n').replace(/^\s+/, '');
}

/** Derive the display title from the first `# heading`, else the filename. */
export function deriveTitle(raw: string, filename: string): string {
    const heading = raw.match(/^#\s+(.+)$/m);

    if (heading) return heading[1].trim();

    return filename.replace(/\.md$/i, '').replace(/[-_]/g, ' ');
}

/**
 * Sort notes by `created` descending (newest first). Ties break by slug
 * alphabetically for stable ordering. Notes without a `created` date go last.
 */
export function sortNotes(notes: NoteMeta[]): NoteMeta[] {
    return [...notes].sort((a, b) => {
        // Descending by created; nulls always last regardless of direction.
        if (a.created === null && b.created === null) return 0;
        if (a.created === null) return 1;
        if (b.created === null) return -1;

        const byDate = b.created.localeCompare(a.created);

        return byDate !== 0 ? byDate : a.slug.localeCompare(b.slug);
    });
}

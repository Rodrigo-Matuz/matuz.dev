import { Link } from 'react-router';

import RelativeTimeTag from '$/components/notes/RelativeTimeTag';
import { useLocale } from '$/lib/language';
import type { NoteIndexEntry } from '$/lib/notes';

interface NoteSidebarProps {
    notes: NoteIndexEntry[];
    /** Slug of the currently open note, if any. */
    activeSlug?: string;
}

/**
 * Chronological list of notes, newest first. Desktop: sticky vertical list.
 * Mobile: horizontal scrollable strip above the content.
 */
export function NoteSidebar({ notes, activeSlug }: NoteSidebarProps) {
    const content = useLocale();

    return (
        <nav aria-label={content.notes.eyebrow}>
            {/* Mobile: horizontal strip */}
            <ul className="flex gap-2 overflow-x-auto pb-2 lg:hidden">
                {notes.map((note) => (
                    <li key={note.slug} className="shrink-0">
                        <Link
                            to={`/notes/${note.slug}`}
                            aria-current={note.slug === activeSlug ? 'page' : undefined}
                            className={`block rounded-sm border px-3 py-2 text-sm transition-colors ${
                                note.slug === activeSlug
                                    ? 'border-primary/40 text-primary'
                                    : 'border-foreground/10 text-muted hover:text-primary'
                            }`}
                        >
                            {note.title}
                        </Link>
                    </li>
                ))}
            </ul>

            {/* Desktop: vertical list */}
            <ul className="hidden lg:block">
                {notes.map((note) => (
                    <li
                        key={note.slug}
                        className="border-b border-foreground/10 last:border-b-0"
                    >
                        <Link
                            to={`/notes/${note.slug}`}
                            aria-current={note.slug === activeSlug ? 'page' : undefined}
                            className={`group block py-3 transition-colors ${
                                note.slug === activeSlug
                                    ? 'text-primary'
                                    : 'text-foreground hover:text-primary'
                            }`}
                        >
                            <span className="block font-display text-base tracking-[-0.02em]">
                                {note.title}
                            </span>
                            <RelativeTimeTag
                                timestamp={note.updated}
                                label={content.notes.updated}
                                className="mt-1 block"
                            />
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default NoteSidebar;

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ChevronDown } from 'lucide-react';

import { useLocale } from '$/lib/language';
import type { NoteIndexEntry } from '$/lib/notes';

interface NoteSidebarProps {
    notes: NoteIndexEntry[];
    /** Slug of the currently open note, if any. */
    activeSlug?: string;
}

interface NoteGroup {
    /** Folder path relative to the notes root; '' for root-level notes. */
    folder: string;
    notes: NoteIndexEntry[];
}

/** Group notes by their containing folder, preserving the incoming order. */
function groupByFolder(notes: NoteIndexEntry[]): NoteGroup[] {
    const groups = new Map<string, NoteIndexEntry[]>();

    for (const note of notes) {
        const folder = note.slug.includes('/')
            ? note.slug.slice(0, note.slug.lastIndexOf('/'))
            : '';

        const bucket = groups.get(folder);

        if (bucket) bucket.push(note);
        else groups.set(folder, [note]);
    }

    return [...groups.entries()].map(([folder, entries]) => ({
        folder,
        notes: entries,
    }));
}

/** Build a locale-safe href for a slug (each path segment encoded). */
function noteHref(slug: string): string {
    return `/notes/${slug.split('/').map(encodeURIComponent).join('/')}`;
}

/**
 * Notes list grouped by folder (nested notes live under their folder
 * heading). Desktop: sticky vertical list. Mobile: a dropdown styled like
 * the header's NavMenu — tap to open, pick a note.
 */
export function NoteSidebar({ notes, activeSlug }: NoteSidebarProps) {
    const content = useLocale();
    const groups = groupByFolder(notes);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    // Track the previous active slug to close the dropdown after navigation
    // without a setState-in-effect (render-time state adjustment).
    const [prevSlug, setPrevSlug] = useState(activeSlug);

    if (activeSlug !== prevSlug) {
        setPrevSlug(activeSlug);

        if (isOpen) setIsOpen(false);
    }

    useEffect(() => {
        if (!isOpen) return;

        const onPointerDown = (event: PointerEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsOpen(false);
        };

        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [isOpen]);

    const activeNote = notes.find((note) => note.slug === activeSlug);

    const renderGroup = (group: NoteGroup) => (
        <li key={group.folder || '__root'}>
            {group.folder ? (
                <p className="mt-4 mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-subtle first:mt-0">
                    {group.folder}
                </p>
            ) : null}
            <ul>
                {group.notes.map((note) => (
                    <li key={note.slug}>
                        <Link
                            to={noteHref(note.slug)}
                            aria-current={
                                note.slug === activeSlug ? 'page' : undefined
                            }
                            onClick={() => setIsOpen(false)}
                            className={`block py-2 font-display text-base tracking-[-0.02em] transition-colors ${
                                note.slug === activeSlug
                                    ? 'text-primary'
                                    : 'text-foreground hover:text-primary'
                            }`}
                        >
                            {note.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </li>
    );

    return (
        <nav aria-label={content.notes.eyebrow}>
            {/* Mobile: dropdown, styled like the header's NavMenu */}
            <div ref={containerRef} className="relative lg:hidden">
                <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-haspopup="menu"
                    onClick={() => setIsOpen((open) => !open)}
                    className="flex w-full items-center justify-between rounded-sm border border-foreground/10 bg-surface px-4 py-3 text-left"
                >
                    <span className="font-display text-base text-foreground">
                        {activeNote ? activeNote.title : content.notes.eyebrow}
                    </span>
                    <ChevronDown
                        size={16}
                        className={`text-subtle transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                {isOpen && (
                    <div
                        role="menu"
                        aria-label={content.notes.eyebrow}
                        className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 max-h-[70vh] overflow-y-auto border border-foreground/10 bg-background p-4 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8)] backdrop-blur-md"
                    >
                        <ul>{groups.map(renderGroup)}</ul>
                    </div>
                )}
            </div>

            {/* Desktop: vertical list grouped by folder */}
            <ul className="hidden lg:block">
                {groups.map(renderGroup)}
            </ul>
        </nav>
    );
}

export default NoteSidebar;

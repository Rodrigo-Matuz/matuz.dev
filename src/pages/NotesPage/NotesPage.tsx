import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import NoteSidebar from '$/components/notes/NoteSidebar';
import Container from '$/components/layout/Container';
import PageShell from '$/components/layout/PageShell';
import Eyebrow from '$/components/ui/Eyebrow';
import { useLocale } from '$/lib/language';
import { fetchNotesIndex, type NoteIndexEntry } from '$/lib/notes';

type LoadState = 'loading' | 'loaded' | 'error';

/**
 * `/notes` — index of public notes, newest first, with the sidebar list.
 */
export function NotesPage() {
    const content = useLocale();
    const [state, setState] = useState<LoadState>('loading');
    const [notes, setNotes] = useState<NoteIndexEntry[]>([]);

    useEffect(() => {
        let cancelled = false;

        fetchNotesIndex()
            .then((index) => {
                if (cancelled) return;

                setNotes(index);
                setState('loaded');
            })
            .catch(() => {
                if (cancelled) return;

                setState('error');
            });

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <PageShell>
            <section className="pb-20 pt-32 sm:pb-24 sm:pt-36">
                <Container>
                    <Eyebrow color="primary" line>
                        {content.notes.eyebrow}
                    </Eyebrow>

                    <h1 className="mt-6 max-w-4xl font-display text-4xl leading-[0.95] tracking-[-0.05em] text-foreground sm:text-6xl">
                        {content.notes.title}
                    </h1>

                    <p className="mt-6 max-w-2xl border-l-2 border-warning pl-4 text-sm leading-6 text-muted">
                        {content.notes.languageNotice}
                    </p>

                    {state === 'loading' && (
                        <p className="mt-16 font-mono text-xs uppercase tracking-[0.18em] text-subtle">
                            …
                        </p>
                    )}

                    {state === 'error' && (
                        <p className="mt-16 text-base text-muted">
                            {content.notes.loadError}
                        </p>
                    )}

                    {state === 'loaded' && notes.length === 0 && (
                        <p className="mt-16 text-base text-muted">
                            {content.notes.empty}
                        </p>
                    )}

                    {state === 'loaded' && notes.length > 0 && (
                        <div className="mt-16 grid gap-12 lg:grid-cols-[16rem_1fr]">
                            <aside className="lg:sticky lg:top-28 lg:self-start">
                                <NoteSidebar notes={notes} />
                            </aside>

                            <div className="min-w-0">
                                <ul>
                                    {notes.map((note) => (
                                        <li
                                            key={note.slug}
                                            className="border-b border-foreground/10"
                                        >
                                            <Link
                                                to={`/notes/${note.slug
                                                    .split('/')
                                                    .map(encodeURIComponent)
                                                    .join('/')}`}
                                                className="group block py-5 transition-colors"
                                            >
                                                <span className="font-display text-xl tracking-[-0.02em] text-foreground transition-colors group-hover:text-primary">
                                                    {note.title}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </Container>
            </section>
        </PageShell>
    );
}

export default NotesPage;

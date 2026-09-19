import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';

import NoteSidebar from '$/components/notes/NoteSidebar';
import RelativeTimeTag from '$/components/notes/RelativeTimeTag';
import Container from '$/components/layout/Container';
import PageShell from '$/components/layout/PageShell';
import { useLocale } from '$/lib/language';
import {
    fetchNoteContent,
    fetchNotesIndex,
    type NoteContent,
    type NoteIndexEntry,
} from '$/lib/notes';

type LoadState = 'loading' | 'loaded' | 'error' | 'not-found';

/**
 * `/notes/:slug` — a single note with the sidebar alongside it.
 * Markdown rendering is handled by the shared NoteMarkdown component.
 */
export function NotePage({ renderContent }: { renderContent: (content: string) => React.ReactNode }) {
    const content = useLocale();
    // Route is a splat (/notes/*), so the slug is the full remainder of the
    // path — segments are decoded individually to preserve '/' separators.
    const params = useParams();
    const splat = params['*'];
    const slug = splat
        ? splat.split('/').map(decodeURIComponent).join('/')
        : undefined;
    const [state, setState] = useState<LoadState>('loading');
    const [note, setNote] = useState<NoteContent | null>(null);
    const [notes, setNotes] = useState<NoteIndexEntry[]>([]);

    useEffect(() => {
        let cancelled = false;

        fetchNotesIndex()
            .then((index) => {
                if (!cancelled) setNotes(index);
            })
            .catch(() => {
                /* sidebar failure is non-fatal */
            });

        if (!slug) return undefined;

        fetchNoteContent(slug)
            .then((result) => {
                if (cancelled) return;

                if (result) {
                    setNote(result);
                    setState('loaded');
                } else {
                    setState('not-found');
                }
            })
            .catch(() => {
                if (!cancelled) setState('error');
            });

        return () => {
            cancelled = true;
        };
    }, [slug]);

    return (
        <PageShell>
            <section className="pb-20 pt-32 sm:pb-24 sm:pt-36">
                <Container>
                    <Link
                        to="/notes"
                        className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-subtle transition-colors hover:text-primary"
                    >
                        <ArrowLeft size={12} />
                        {content.notes.backToNotes}
                    </Link>

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

                    {state === 'not-found' && (
                        <p className="mt-16 text-base text-muted">
                            {content.notes.notFound}
                        </p>
                    )}

                    {state === 'loaded' && note && (
                        <div className="mt-12 grid gap-12 lg:grid-cols-[16rem_1fr]">
                            <aside className="lg:sticky lg:top-28 lg:self-start">
                                <NoteSidebar notes={notes} activeSlug={note.slug} />
                            </aside>

                            <article className="min-w-0">
                                <header className="border-b border-foreground/10 pb-6">
                                    <h1 className="font-display text-3xl leading-[1.05] tracking-[-0.04em] text-foreground sm:text-4xl">
                                        {note.title}
                                    </h1>
                                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1">
                                        <RelativeTimeTag
                                            timestamp={note.created}
                                            label={content.notes.created}
                                        />
                                        <RelativeTimeTag
                                            timestamp={note.updated}
                                            label={content.notes.updated}
                                        />
                                    </div>
                                </header>

                                <div className="mt-8">
                                    {renderContent(note.content)}
                                </div>
                            </article>
                        </div>
                    )}
                </Container>
            </section>
        </PageShell>
    );
}

export default NotePage;

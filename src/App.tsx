import { AnimatePresence, MotionConfig } from 'motion/react';
import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router';

import { AboutPage } from '$/pages/AboutPage';
import { ContactPage } from '$/pages/ContactPage';
import { HomePage } from '$/pages/HomePage';
import { NotePage } from '$/pages/NotePage';
import { NotesPage } from '$/pages/NotesPage';
import { NotFoundPage } from '$/pages/NotFoundPage';
import { ProjectsPage } from '$/pages/ProjectsPage';
import { ProjectDemoPage } from '$/pages/ProjectDemoPage';
import HashScroller from '$/lib/hash-scroller';

// The markdown pipeline (react-markdown + KaTeX + highlight.js) is by far
// the heaviest part of the bundle and is only used by notes — load it on
// demand so the other routes ship without it.
const NoteMarkdown = lazy(() => import('$/components/notes/NoteMarkdown'));

function NotePageRoute() {
    return (
        <NotePage
            renderContent={(content) => (
                <Suspense fallback={<MarkdownFallback />}>
                    <NoteMarkdown content={content} />
                </Suspense>
            )}
        />
    );
}

/** Placeholder while the lazy markdown chunk streams in. */
function MarkdownFallback() {
    return (
        <p
            aria-hidden="true"
            className="mt-16 font-mono text-xs uppercase tracking-[0.18em] text-subtle"
        >
            …
        </p>
    );
}

function AppRoutes() {
    const location = useLocation();

    return (
        // AnimatePresence keeps the outgoing page mounted while its exit
        // animation plays — the crossfade that makes route changes feel like
        // one continuous site rather than hard document loads.
        // `initial` stays enabled (default true) so the FIRST page load also
        // animates in; with initial={false} the home page would render
        // statically and only animate after navigating away and back.
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:slug" element={<ProjectDemoPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/notes" element={<NotesPage />} />
                {/* Splat so nested slugs (user1/FileNameTitle) match. */}
                <Route path="/notes/*" element={<NotePageRoute />} />
                {/* Anything unregistered falls through to the 404 page. */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </AnimatePresence>
    );
}

function App() {
    return (
        // `reducedMotion="user"` disables transform/layout animations for
        // users with prefers-reduced-motion enabled; opacity fades still run.
        <MotionConfig reducedMotion="user">
            <BrowserRouter>
                <HashScroller />
                <AppRoutes />
            </BrowserRouter>
        </MotionConfig>
    );
}

export default App;

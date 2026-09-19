import { AnimatePresence, MotionConfig } from 'motion/react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router';

import { AboutPage } from '$/pages/AboutPage';
import { ContactPage } from '$/pages/ContactPage';
import { HomePage } from '$/pages/HomePage';
import { NotePage } from '$/pages/NotePage';
import { NotesPage } from '$/pages/NotesPage';
import { ProjectsPage } from '$/pages/ProjectsPage';
import NoteMarkdown from '$/components/notes/NoteMarkdown';

function NotePageRoute() {
    return <NotePage renderContent={(content) => <NoteMarkdown content={content} />} />;
}

function AppRoutes() {
    const location = useLocation();

    return (
        // AnimatePresence keeps the outgoing page mounted while its exit
        // animation plays — the crossfade that makes route changes feel like
        // one continuous site rather than hard document loads.
        <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/notes" element={<NotesPage />} />
                {/* Splat so nested slugs (user1/FileNameTitle) match. */}
                <Route path="/notes/*" element={<NotePageRoute />} />
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
                <AppRoutes />
            </BrowserRouter>
        </MotionConfig>
    );
}

export default App;

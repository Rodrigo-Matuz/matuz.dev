import { motion, useAnimationControls } from 'motion/react';
import type { ReactNode } from 'react';

import Footer from '$/components/layout/Footer';
import Header from '$/components/layout/Header';
import PageBackground from '$/components/layout/PageBackground';
import { EASE } from '$/lib/motion';
import { setLanguage, useLanguage, type Language } from '$/lib/language';

interface PageShellProps {
    /** Page background image; omit for the plain gradient treatment. */
    backgroundSrc?: string;
    children: ReactNode;
}

/**
 * Shared page chrome: fixed header, optional background image, footer, and
 * the language-switch fade applied to everything inside the shell.
 */
export function PageShell({ backgroundSrc, children }: PageShellProps) {
    const language = useLanguage();
    const contentControls = useAnimationControls();

    const handleLanguageChange = (nextLanguage: Language) => {
        if (nextLanguage === language) return;

        setLanguage(nextLanguage);
        contentControls.start({
            opacity: [0, 1],
            y: [8, 0],
            transition: { duration: 0.45, ease: EASE },
        });
    };

    return (
        <div className="relative isolate flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
            <PageBackground src={backgroundSrc} />

            <Header language={language} onLanguageChange={handleLanguageChange} />

            <motion.main
                id="top"
                className="relative z-10 flex-1"
                animate={contentControls}
                initial={false}
            >
                {children}
            </motion.main>

            <motion.div animate={contentControls} initial={false}>
                <Footer language={language} />
            </motion.div>
        </div>
    );
}

export default PageShell;

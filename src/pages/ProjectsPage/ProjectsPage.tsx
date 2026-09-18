import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

import Container from '$/components/layout/Container';
import PageShell from '$/components/layout/PageShell';
import Section from '$/components/layout/Section';
import ProjectCard from '$/components/content/ProjectCard';
import Button from '$/components/ui/Button';
import Eyebrow from '$/components/ui/Eyebrow';
import { useLocale } from '$/lib/language';
import {
    fadeUp,
    pageVariants,
    staggerContainer,
    viewportOnce,
} from '$/lib/motion';
import matuzDevImage from '$/assets/project-matuz-dev.webp';
import wallpaperPickerImage from '$/assets/project-wallpaper-picker.webp';

// Card images are Vite asset imports, not locale data — JSON can't hold them.
// Keyed by the stable card id from the locale dictionaries.
const cardImages: Record<string, string> = {
    'wallpaper-picker': wallpaperPickerImage,
    'matuz-dev': matuzDevImage,
};

/**
 * `/projects` — selected work as a card grid: one card per row on mobile,
 * three per row on desktop. Copy and card data come from the locale
 * dictionaries; the grid itself is intentionally dumb.
 */
export function ProjectsPage() {
    const content = useLocale();
    const { projects } = content;

    return (
        <PageShell>
            <motion.article
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
            >
                {/* Heading */}
                <section className="pb-16 pt-32 sm:pb-20 sm:pt-36">
                    <Container>
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div variants={fadeUp}>
                                <Eyebrow color="primary" line>
                                    {projects.eyebrow}
                                </Eyebrow>
                            </motion.div>

                            <motion.h1
                                variants={fadeUp}
                                className="mt-6 max-w-4xl font-display text-5xl leading-[0.91] tracking-[-0.055em] text-foreground sm:text-7xl lg:text-[5.5rem]"
                            >
                                {projects.title}
                            </motion.h1>

                            <motion.p
                                variants={fadeUp}
                                className="mt-8 max-w-2xl border-t-2 border-highlight pt-6 text-base leading-7 text-muted sm:text-lg sm:leading-8"
                            >
                                {projects.description}
                            </motion.p>
                        </motion.div>
                    </Container>
                </section>

                {/* Card grid */}
                <Section id="projects-grid" band="soft">
                    <Container className="py-20 sm:py-28">
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={viewportOnce}
                        >
                            <motion.ul
                                variants={fadeUp}
                                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
                            >
                                {projects.cards.map((card) => (
                                    <li key={card.id} className="h-full">
                                        <ProjectCard
                                            title={card.title}
                                            description={card.description}
                                            image={cardImages[card.id]}
                                            technologies={card.technologies}
                                            github={card.github}
                                            preview={card.preview}
                                            sourceLabel={projects.sourceLabel}
                                            previewLabel={projects.previewLabel}
                                        />
                                    </li>
                                ))}
                            </motion.ul>
                        </motion.div>
                    </Container>
                </Section>

                {/* Closing */}
                <Section id="projects-closing" band="soft">
                    <Container className="py-20 sm:py-28">
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={viewportOnce}
                        >
                            <motion.div
                                variants={fadeUp}
                                className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end"
                            >
                                <p className="max-w-md text-sm leading-6 text-subtle sm:text-base">
                                    {content.correspondence.description}
                                </p>
                                <Button
                                    href={content.correspondence.emailHref}
                                    color="outline"
                                >
                                    {content.correspondence.primaryAction}
                                    <ArrowUpRight
                                        size={15}
                                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                    />
                                </Button>
                            </motion.div>
                        </motion.div>
                    </Container>
                </Section>
            </motion.article>
        </PageShell>
    );
}

export default ProjectsPage;

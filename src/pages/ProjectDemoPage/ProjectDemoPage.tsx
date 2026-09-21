import { Link, useParams } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

import Container from '$/components/layout/Container';
import PageShell from '$/components/layout/PageShell';
import Section from '$/components/layout/Section';
import BrandIcon from '$/components/ui/BrandIcon';
import Eyebrow from '$/components/ui/Eyebrow';
import { useLocale } from '$/lib/language';
import {
    fadeUp,
    pageVariants,
    staggerContainer,
    viewportOnce,
} from '$/lib/motion';

/** Extract a YouTube video ID from common URL shapes; null when not YouTube. */
function youtubeId(href: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
        /(?:youtu\.be\/)([\w-]{11})/,
        /(?:youtube\.com\/embed\/)([\w-]{11})/,
        /(?:youtube\.com\/shorts\/)([\w-]{11})/,
    ];

    for (const pattern of patterns) {
        const match = href.match(pattern);

        if (match) return match[1];
    }

    return null;
}

/**
 * `/projects/:slug` — reusable demo page for every project. One layout,
 * driven entirely by the locale dictionaries: title, tech tags, a long-form
 * description, and an optional video demo (YouTube embed or GitHub
 * attachment video). Unknown slugs fall back to the projects index.
 */
export function ProjectDemoPage() {
    const content = useLocale();
    const { projects } = content;
    const { slug } = useParams();
    const card = projects.cards.find((candidate) => candidate.id === slug);

    if (!card) {
        return (
            <PageShell>
                <section className="pb-20 pt-32 sm:pb-24 sm:pt-36">
                    <Container>
                        <Link
                            to="/projects"
                            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-subtle transition-colors hover:text-primary"
                        >
                            <ArrowLeft size={12} />
                            {projects.backToProjects}
                        </Link>

                        <p className="mt-16 text-base text-muted">
                            {content.notes.notFound}
                        </p>
                    </Container>
                </section>
            </PageShell>
        );
    }

    const videoId = card.demo?.video ? youtubeId(card.demo.video) : null;
    const isGitHubVideo = Boolean(
        card.demo?.video && !videoId && card.demo.video.includes('github.com'),
    );

    return (
        <PageShell>
            <motion.article
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
            >
                {/* Title + tags */}
                <section className="pb-16 pt-32 sm:pb-20 sm:pt-36">
                    <Container>
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div variants={fadeUp}>
                                <Link
                                    to="/projects"
                                    className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-subtle transition-colors hover:text-primary"
                                >
                                    <ArrowLeft size={12} />
                                    {projects.backToProjects}
                                </Link>
                            </motion.div>

                            <motion.h1
                                variants={fadeUp}
                                className="mt-6 max-w-4xl font-display text-5xl leading-[0.91] tracking-[-0.055em] text-foreground sm:text-7xl lg:text-[5.5rem]"
                            >
                                {card.title}
                            </motion.h1>

                            <motion.ul
                                variants={fadeUp}
                                aria-label={card.title}
                                className="mt-8 flex flex-wrap gap-2"
                            >
                                {card.technologies.map((technology) => (
                                    <li key={technology}>
                                        <span className="inline-flex items-center border border-foreground/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-muted">
                                            {technology}
                                        </span>
                                    </li>
                                ))}
                            </motion.ul>

                            <motion.div
                                variants={fadeUp}
                                className="mt-8 flex flex-wrap gap-3"
                            >
                                <a
                                    href={card.github}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group inline-flex items-center gap-2 border border-foreground/15 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-foreground transition-colors hover:border-success hover:text-success"
                                >
                                    <BrandIcon name="github" size={15} />
                                    {projects.sourceLabel}
                                    <ArrowUpRight
                                        size={14}
                                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                    />
                                </a>

                                {card.preview && (
                                    <a
                                        href={card.preview}
                                        target={
                                            card.preview.startsWith('http')
                                                ? '_blank'
                                                : undefined
                                        }
                                        rel="noreferrer"
                                        className="group inline-flex items-center gap-2 border border-foreground/15 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-foreground transition-colors hover:border-primary hover:text-primary"
                                    >
                                        {projects.previewLabel}
                                        <ArrowUpRight
                                            size={14}
                                            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                        />
                                    </a>
                                )}
                            </motion.div>
                        </motion.div>
                    </Container>
                </section>

                {/* Description + video demo */}
                <Section id="project-demo" band="soft">
                    <Container className="py-20 sm:py-28">
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={viewportOnce}
                        >
                            <motion.div
                                variants={fadeUp}
                                className="max-w-3xl border-t-2 border-primary pt-6"
                            >
                                {card.demo?.paragraphs.map((paragraph) => (
                                    <p
                                        key={paragraph}
                                        className="mt-5 text-base leading-7 text-muted first:mt-0 sm:text-lg sm:leading-8"
                                    >
                                        {paragraph}
                                    </p>
                                ))}
                            </motion.div>

                            {card.demo?.video && (
                                <motion.figure
                                    variants={fadeUp}
                                    className="mt-14"
                                >
                                    <figcaption className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-subtle">
                                        {projects.demo.videoTitle}
                                    </figcaption>

                                    {videoId ? (
                                        <div className="mt-4 aspect-video w-full overflow-hidden rounded-sm border border-foreground/10">
                                            <iframe
                                                src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                                                title={projects.demo.videoTitle}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                loading="lazy"
                                                className="h-full w-full"
                                            />
                                        </div>
                                    ) : isGitHubVideo ? (
                                        <video
                                            controls
                                            src={card.demo.video}
                                            className="mt-4 w-full rounded-sm border border-foreground/10"
                                        />
                                    ) : null}
                                </motion.figure>
                            )}

                            {!card.demo?.video && (
                                <motion.p
                                    variants={fadeUp}
                                    className="mt-14 max-w-2xl border-l-2 border-warning pl-4 text-sm leading-6 text-muted"
                                >
                                    {projects.demo.noVideo}
                                </motion.p>
                            )}
                        </motion.div>
                    </Container>
                </Section>

                {/* Back to projects */}
                <Section id="project-demo-closing" band="soft">
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
                                <Eyebrow color="primary">
                                    {projects.eyebrow}
                                </Eyebrow>
                                <Link
                                    to="/projects"
                                    className="group inline-flex items-center gap-2 border border-foreground/15 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-foreground transition-colors hover:border-primary hover:text-primary"
                                >
                                    {projects.backToProjects}
                                    <ArrowUpRight
                                        size={14}
                                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                    />
                                </Link>
                            </motion.div>
                        </motion.div>
                    </Container>
                </Section>
            </motion.article>
        </PageShell>
    );
}

export default ProjectDemoPage;

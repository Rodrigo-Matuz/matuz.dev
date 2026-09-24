import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

import Container from '$/components/layout/Container';
import PageShell from '$/components/layout/PageShell';
import Section from '$/components/layout/Section';
import Button from '$/components/ui/Button';
import Eyebrow from '$/components/ui/Eyebrow';
import { useLocale } from '$/lib/language';
import { usePageMeta } from '$/lib/page-meta';
import {
    fadeUp,
    pageVariants,
    staggerContainer,
    viewportOnce,
} from '$/lib/motion';

const skillAccentClasses = ['text-primary', 'text-secondary', 'text-accent'];

/**
 * `/about` — what this site is, and who is behind it.
 *
 * Copy is sourced from the bilingual locale dictionaries (`src/content/`),
 * with the biography grounded in the owner's CV. The CV file itself is
 * personal and git-ignored — never commit or ship it.
 */
export function AboutPage() {
    const content = useLocale();
    const { about } = content;

    usePageMeta({
        title: `${content.owner.displayName} — ${about.eyebrow} · matuz.dev`,
        description: about.whoAmI.intro,
    });

    return (
        <PageShell>
            <motion.article
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
            >
                {' '}
                {/* Why this site exists */}
                <section className="pb-20 pt-32 sm:pb-24 sm:pt-36">
                    <Container>
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div variants={fadeUp}>
                                <Eyebrow color="primary" line>
                                    {about.eyebrow}
                                </Eyebrow>
                            </motion.div>

                            <motion.h1
                                variants={fadeUp}
                                className="mt-6 max-w-4xl font-display text-5xl leading-[0.91] tracking-[-0.055em] text-foreground sm:text-7xl lg:text-[5.5rem]"
                            >
                                {about.title}
                            </motion.h1>

                            <motion.div
                                variants={fadeUp}
                                className="mt-10 max-w-2xl border-t-2 border-warning pt-6"
                            >
                                {about.sitePurpose.map((paragraph) => (
                                    <p
                                        key={paragraph}
                                        className="mt-5 text-base leading-7 text-muted first:mt-0 sm:text-lg sm:leading-8"
                                    >
                                        {paragraph}
                                    </p>
                                ))}
                            </motion.div>
                        </motion.div>
                    </Container>
                </section>
                {/* Who am I */}
                <Section id="who-am-i" band="soft">
                    <Container className="py-20 sm:py-28">
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={viewportOnce}
                        >
                            <motion.div variants={fadeUp}>
                                <Eyebrow color="success">
                                    {about.whoAmI.eyebrow}
                                </Eyebrow>
                                <h2 className="mt-5 font-display text-4xl leading-[0.98] tracking-[-0.045em] sm:text-5xl">
                                    {about.whoAmI.title}
                                </h2>
                            </motion.div>

                            <motion.div
                                variants={fadeUp}
                                className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_0.8fr] lg:gap-20"
                            >
                                <div className="max-w-2xl">
                                    <p className="text-base leading-7 text-foreground sm:text-lg sm:leading-8">
                                        {about.whoAmI.intro}
                                    </p>
                                    {about.whoAmI.bio.map((paragraph) => (
                                        <p
                                            key={paragraph}
                                            className="mt-6 text-sm leading-7 text-muted sm:text-base sm:leading-8"
                                        >
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>

                                <div className="grid gap-8">
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                                            {about.whoAmI.skills.eyebrow}
                                        </p>
                                        <p className="mt-4 font-display text-2xl leading-tight tracking-[-0.03em]">
                                            {about.whoAmI.skills.title}
                                        </p>
                                    </div>

                                    <div className="divide-y divide-foreground/10 border-t border-foreground/10">
                                        {about.whoAmI.skills.groups.map(
                                            (group, index) => (
                                                <div
                                                    key={group.label}
                                                    className="grid gap-1 py-4 sm:grid-cols-[8rem_1fr] sm:gap-4"
                                                >
                                                    <p
                                                        className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${skillAccentClasses[index % skillAccentClasses.length]}`}
                                                    >
                                                        {group.label}
                                                    </p>
                                                    <p className="text-sm leading-6 text-muted">
                                                        {group.items}
                                                    </p>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </Container>
                </Section>
                {/* Credentials */}
                <Section id="credentials" band="soft">
                    <Container className="py-20 sm:py-28">
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={viewportOnce}
                        >
                            <motion.div variants={fadeUp}>
                                <Eyebrow color="highlight">
                                    {about.whoAmI.certificates.eyebrow}
                                </Eyebrow>
                                <h2 className="mt-5 font-display text-4xl leading-[0.98] tracking-[-0.045em] sm:text-5xl">
                                    {about.whoAmI.certificates.title}
                                </h2>
                            </motion.div>

                            <motion.div
                                variants={fadeUp}
                                className="mt-10 grid gap-12 lg:grid-cols-2"
                            >
                                <ul className="border-t border-foreground/10">
                                    {about.whoAmI.certificates.items.map(
                                        (certificate) => (
                                            <li
                                                key={certificate}
                                                className="border-b border-foreground/10 py-4 text-sm leading-6 text-muted sm:text-base"
                                            >
                                                {certificate}
                                            </li>
                                        ),
                                    )}
                                </ul>

                                <ul className="border-t border-foreground/10">
                                    {about.whoAmI.certificates.languages.map(
                                        (language) => (
                                            <li
                                                key={language}
                                                className="border-b border-foreground/10 py-4 text-sm leading-6 text-muted sm:text-base"
                                            >
                                                {language}
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </motion.div>
                        </motion.div>
                    </Container>
                </Section>
                {/* Beyond work — NixOS, shell, dotfiles */}
                <Section id="beyond-work" band="soft">
                    <Container className="py-20 sm:py-28">
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={viewportOnce}
                        >
                            <motion.div variants={fadeUp}>
                                <Eyebrow color="secondary">
                                    {about.whoAmI.beyondWork.eyebrow}
                                </Eyebrow>
                                <h2 className="mt-5 font-display text-4xl leading-[0.98] tracking-[-0.045em] sm:text-5xl">
                                    {about.whoAmI.beyondWork.title}
                                </h2>
                            </motion.div>

                            <motion.div
                                variants={fadeUp}
                                className="mt-8 max-w-2xl border-t-2 border-secondary pt-6"
                            >
                                {about.whoAmI.beyondWork.paragraphs.map(
                                    (paragraph) => (
                                        <p
                                            key={paragraph}
                                            className="mt-5 text-sm leading-7 text-muted first:mt-0 sm:text-base sm:leading-8"
                                        >
                                            {paragraph}
                                        </p>
                                    ),
                                )}
                            </motion.div>
                        </motion.div>
                    </Container>
                </Section>
                {/* Back to home */}
                <Section id="about-closing" band="soft">
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
                                    {about.whoAmI.closing}
                                </p>
                                <Button to="/" color="outline">
                                    {content.correspondence.secondaryAction}
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

export default AboutPage;

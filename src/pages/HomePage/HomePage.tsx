import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import BrandIcon, { isBrandIconName } from '$/components/ui/BrandIcon';
import SafeLink from '$/components/ui/SafeLink';
import Container from '$/components/layout/Container';
import PageShell from '$/components/layout/PageShell';
import Section from '$/components/layout/Section';
import SectionHeading from '$/components/layout/SectionHeading';
import ArrowLink from '$/components/ui/ArrowLink';
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
import backgroundImage from '$/assets/hero-background.webp';

// Per-item accents. All of these are light enough to read on the dark
// background — do not swap for darker shades of the brand palette.
const serviceAccentClasses = [
    'text-primary',
    'text-secondary',
    'text-accent',
    'text-warning',
];
const experienceAccentClasses = [
    'text-success',
    'text-highlight',
    'text-secondary',
    'text-accent',
    'text-warning',
    'text-primary',
];
// `hover:` (not `group-hover:`) — group-hover only styles descendants of the
// group, so it would never apply to the anchor itself.
const correspondenceHoverClasses = [
    'hover:text-secondary',
    'hover:text-primary',
    'hover:text-accent',
    'hover:text-warning',
    'hover:text-success',
    'hover:text-highlight',
];
const correspondenceMetaHoverClasses = [
    'group-hover:text-secondary',
    'group-hover:text-primary',
    'group-hover:text-accent',
    'group-hover:text-warning',
    'group-hover:text-success',
    'group-hover:text-highlight',
];

export function HomePage() {
    const content = useLocale();

    usePageMeta({
        title: content.meta.homeTitle,
        description: content.meta.description,
    });

    return (
        <PageShell backgroundSrc={backgroundImage}>
            <motion.article
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
            >
                <section className="flex min-h-screen flex-col justify-center pb-20 pt-32 sm:pb-24 sm:pt-36">
                    <Container>
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div variants={fadeUp}>
                                <Eyebrow color="primary" line>
                                    {content.owner.location}
                                </Eyebrow>
                            </motion.div>

                            <motion.div
                                variants={fadeUp}
                                className="mt-9 max-w-5xl lg:max-w-6xl"
                            >
                                <p className="font-display text-lg italic leading-tight text-success sm:text-xl">
                                    {content.hero.kicker}
                                </p>
                                <h1 className="mt-3 font-display text-5xl leading-[0.91] tracking-[-0.055em] text-foreground sm:text-7xl lg:text-[5.5rem] xl:text-[6rem]">
                                    {content.hero.title}
                                </h1>
                            </motion.div>

                            <motion.div
                                variants={fadeUp}
                                className="mt-10 grid max-w-4xl gap-8 border-t-2 border-accent pt-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
                            >
                                <p className="max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
                                    {content.hero.introduction}
                                </p>
                                <ArrowLink href="#record" hover="accent">
                                    {content.hero.recordLink}
                                </ArrowLink>
                            </motion.div>

                            <motion.p
                                variants={fadeUp}
                                className="mt-16 font-display text-sm italic text-subtle sm:mt-20"
                            >
                                {content.hero.closingLine}
                            </motion.p>
                        </motion.div>
                    </Container>
                </section>

                <Section id="record" band="soft">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportOnce}
                    >
                        <Container className="grid gap-12 py-20 sm:py-28 lg:grid-cols-[0.8fr_1.6fr] lg:gap-20">
                            <motion.div variants={fadeUp}>
                                <Eyebrow color="warning">
                                    {content.record.eyebrow}
                                </Eyebrow>
                                <h2 className="mt-5 max-w-sm font-display text-4xl leading-[0.98] tracking-[-0.045em] sm:text-5xl">
                                    {content.record.title}
                                </h2>
                            </motion.div>
                            <motion.div
                                variants={fadeUp}
                                className="grid gap-9 sm:grid-cols-2 sm:gap-x-12"
                            >
                                {content.record.entries.map((entry, index) => (
                                    <article
                                        key={entry.label}
                                        className="border-t border-border pt-4"
                                    >
                                        <p
                                            className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${serviceAccentClasses[index]}`}
                                        >
                                            {entry.label}
                                        </p>
                                        <p className="mt-4 font-display text-2xl leading-tight tracking-[-0.03em] text-foreground">
                                            {entry.title}
                                        </p>
                                        <p className="mt-3 text-sm leading-6 text-muted">
                                            {entry.description}
                                        </p>
                                    </article>
                                ))}
                            </motion.div>
                        </Container>
                    </motion.div>
                </Section>

                <Section id="experience" band="soft">
                    <Container className="py-20 sm:py-28">
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={viewportOnce}
                        >
                            <motion.div variants={fadeUp}>
                                <SectionHeading
                                    layout="split"
                                    eyebrow={
                                        <Eyebrow color="success">
                                            {content.experience.eyebrow}
                                        </Eyebrow>
                                    }
                                    title={content.experience.title}
                                    description={content.experience.description}
                                    action={
                                        <ArrowLink
                                            href="#experience-highlights"
                                            className="mt-8"
                                        >
                                            {content.experience.recordLink}
                                        </ArrowLink>
                                    }
                                >
                                    <ol
                                        id="experience-highlights"
                                        className="border-t border-border"
                                    >
                                        {content.experience.highlights.map(
                                            (highlight, index) => (
                                                <li
                                                    key={highlight}
                                                    className="grid grid-cols-[3rem_1fr] gap-4 border-b border-border py-5 sm:grid-cols-[5rem_1fr]"
                                                >
                                                    <span
                                                        className={`font-mono text-sm font-semibold tracking-[0.1em] sm:text-base ${experienceAccentClasses[index]}`}
                                                    >
                                                        0{index + 1}
                                                    </span>
                                                    <p className="font-display text-xl leading-snug tracking-[-0.025em] text-foreground sm:text-2xl">
                                                        {highlight}
                                                    </p>
                                                </li>
                                            ),
                                        )}
                                    </ol>
                                </SectionHeading>
                            </motion.div>
                        </motion.div>
                    </Container>
                </Section>

                <Section id="approach" band="soft">
                    <Container className="py-20 sm:py-28">
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={viewportOnce}
                        >
                            <motion.div variants={fadeUp}>
                                <Eyebrow color="highlight">
                                    {content.approach.eyebrow}
                                </Eyebrow>
                            </motion.div>
                            <motion.div
                                variants={fadeUp}
                                className="mt-7 grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end lg:gap-20"
                            >
                                <h2 className="max-w-4xl font-display text-4xl leading-[0.98] tracking-[-0.045em] sm:text-6xl">
                                    {content.approach.title}
                                </h2>
                                <p className="max-w-md text-sm leading-7 text-muted sm:text-base">
                                    {content.approach.description}
                                </p>
                            </motion.div>
                        </motion.div>
                    </Container>
                </Section>

                <Section id="correspondence" band="soft">
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
                                <div>
                                    <Eyebrow color="accent">
                                        {content.correspondence.eyebrow}
                                    </Eyebrow>
                                    <h2 className="mt-4 max-w-2xl font-display text-4xl tracking-[-0.045em] sm:text-5xl">
                                        {content.correspondence.title}
                                    </h2>
                                </div>
                                <p className="max-w-xs text-sm leading-6 text-subtle">
                                    {content.correspondence.description}
                                </p>
                            </motion.div>

                            <motion.div
                                variants={fadeUp}
                                className="mt-8 flex flex-wrap gap-3"
                            >
                                <Button
                                    href={content.correspondence.emailHref}
                                    color="accent"
                                >
                                    {content.correspondence.primaryAction}
                                    <ArrowUpRight
                                        size={15}
                                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                    />
                                </Button>
                                <Button href="#experience" color="outline">
                                    {content.correspondence.secondaryAction}
                                    <ArrowRight
                                        size={15}
                                        className="transition-transform group-hover:translate-x-0.5"
                                    />
                                </Button>
                            </motion.div>

                            <motion.div
                                variants={fadeUp}
                                className="mt-4 divide-y divide-foreground/10"
                            >
                                {content.links.map((link, index) => (
                                    <SafeLink
                                        key={link.label}
                                        href={link.href}
                                        className={`group flex items-center justify-between py-5 transition-colors ${correspondenceHoverClasses[index % correspondenceHoverClasses.length]}`}
                                    >
                                        <span className="flex items-center gap-4">
                                            {typeof link.icon === 'string' &&
                                                isBrandIconName(link.icon) && (
                                                    <BrandIcon
                                                        name={link.icon}
                                                        size={22}
                                                        className="shrink-0 transition-transform group-hover:scale-110 sm:size-6"
                                                    />
                                                )}
                                            <span className="font-display text-2xl tracking-[-0.03em] sm:text-3xl">
                                                {link.label}
                                            </span>
                                        </span>
                                        <span
                                            className={`flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.16em] text-subtle transition-colors ${correspondenceMetaHoverClasses[index % correspondenceMetaHoverClasses.length]}`}
                                        >
                                            <span>0{index + 1}</span>
                                            <ArrowUpRight
                                                size={18}
                                                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                            />
                                        </span>
                                    </SafeLink>
                                ))}
                            </motion.div>
                        </motion.div>
                    </Container>
                </Section>
            </motion.article>
        </PageShell>
    );
}

import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

import Container from '$/components/layout/Container';
import PageShell from '$/components/layout/PageShell';
import Section from '$/components/layout/Section';
import BrandIcon, { isBrandIconName } from '$/components/ui/BrandIcon';
import Eyebrow from '$/components/ui/Eyebrow';
import SafeLink from '$/components/ui/SafeLink';
import { useLocale } from '$/lib/language';
import { usePageMeta } from '$/lib/page-meta';
import {
    fadeUp,
    pageVariants,
    staggerContainer,
    viewportOnce,
} from '$/lib/motion';

const channelAccentClasses = [
    'text-primary',
    'text-secondary',
    'text-accent',
    'text-success',
];

/**
 * `/contact` — where to find me. Email-first by design: the owner prefers
 * email over everything else; Discord is listed as a personal space that
 * anyone may still message. Channels come from the locale dictionaries.
 */
export function ContactPage() {
    const content = useLocale();
    const { contact } = content;

    usePageMeta({
        title: `${content.owner.displayName} — ${contact.eyebrow} · matuz.dev`,
        description: contact.description,
    });

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
                                    {contact.eyebrow}
                                </Eyebrow>
                            </motion.div>

                            <motion.h1
                                variants={fadeUp}
                                className="mt-6 max-w-4xl font-display text-5xl leading-[0.91] tracking-[-0.055em] text-foreground sm:text-7xl lg:text-[5.5rem]"
                            >
                                {contact.title}
                            </motion.h1>

                            <motion.div
                                variants={fadeUp}
                                className="mt-8 max-w-2xl border-t-2 border-success pt-6"
                            >
                                <p className="text-base leading-7 text-muted sm:text-lg sm:leading-8">
                                    {contact.description}
                                </p>
                                <p className="mt-4 text-sm leading-6 text-subtle sm:text-base">
                                    {contact.emailNote}
                                </p>
                            </motion.div>
                        </motion.div>
                    </Container>
                </section>

                {/* Channels */}
                <Section id="contact-channels" band="soft">
                    <Container className="py-20 sm:py-28">
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={viewportOnce}
                        >
                            <motion.ul
                                variants={fadeUp}
                                className="divide-y divide-foreground/10 border-t border-foreground/10"
                            >
                                {contact.channels.map((channel, index) => (
                                    <li key={channel.id}>
                                        {/* SafeLink keeps the destination out
                                            of the static HTML (anti-scraping). */}
                                        <SafeLink
                                            href={channel.href}
                                            target={
                                                channel.href.startsWith('http')
                                                    ? '_blank'
                                                    : undefined
                                            }
                                            rel="noreferrer"
                                            className={`group grid gap-2 py-6 transition-colors sm:grid-cols-[10rem_1fr_auto] sm:items-center sm:gap-6 ${channelAccentClasses[index % channelAccentClasses.length]} hover:text-foreground`}
                                        >
                                            <span className="flex items-center gap-3">
                                                {typeof channel.icon ===
                                                    'string' &&
                                                    isBrandIconName(
                                                        channel.icon,
                                                    ) && (
                                                        <BrandIcon
                                                            name={channel.icon}
                                                            size={18}
                                                            className="shrink-0 opacity-70 transition-opacity group-hover:opacity-100"
                                                        />
                                                    )}
                                                <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">
                                                    {channel.label}
                                                </span>
                                            </span>

                                            <span className="min-w-0">
                                                <span className="block font-display text-2xl tracking-[-0.03em] text-foreground transition-colors sm:text-3xl">
                                                    {channel.value}
                                                </span>
                                                <span className="mt-1 block text-sm leading-6 text-muted">
                                                    {channel.note}
                                                </span>
                                            </span>

                                            <span className="hidden items-center gap-4 text-[10px] font-medium uppercase tracking-[0.16em] text-subtle transition-colors sm:flex">
                                                <span>0{index + 1}</span>
                                                <ArrowUpRight
                                                    size={18}
                                                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                                />
                                            </span>
                                        </SafeLink>
                                    </li>
                                ))}
                            </motion.ul>

                            <motion.p
                                variants={fadeUp}
                                className="mt-8 text-sm leading-6 text-subtle sm:text-base"
                            >
                                {contact.discordNote}
                            </motion.p>
                        </motion.div>
                    </Container>
                </Section>

                {/* Closing */}
                <Section id="contact-closing" band="soft">
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
                                    {contact.closing}
                                </p>
                                <SafeLink
                                    href={content.correspondence.emailHref}
                                    className="group inline-flex items-center gap-2 bg-accent px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-accent/85"
                                >
                                    {content.correspondence.primaryAction}
                                    <ArrowUpRight
                                        size={15}
                                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                    />
                                </SafeLink>
                            </motion.div>
                        </motion.div>
                    </Container>
                </Section>
            </motion.article>
        </PageShell>
    );
}

export default ContactPage;

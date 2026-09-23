import { motion } from 'motion/react';

import Container from '$/components/layout/Container';
import PageShell from '$/components/layout/PageShell';
import Button from '$/components/ui/Button';
import Eyebrow from '$/components/ui/Eyebrow';
import { useLocale } from '$/lib/language';
import { fadeUp, pageVariants, staggerContainer } from '$/lib/motion';

/**
 * `*` — catch-all route for unregistered addresses. Explains the miss in the
 * active language and offers the way back home. The header/footer chrome
 * stays intact so the visitor never loses the site's navigation.
 */
export function NotFoundPage() {
    const content = useLocale();
    const { notFound } = content;

    return (
        <PageShell>
            <motion.article
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
            >
                <section className="pb-16 pt-32 sm:pb-20 sm:pt-36">
                    <Container>
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div variants={fadeUp}>
                                <Eyebrow color="primary" line>
                                    {notFound.eyebrow}
                                </Eyebrow>
                            </motion.div>

                            <motion.p
                                variants={fadeUp}
                                aria-hidden="true"
                                className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-subtle"
                            >
                                {notFound.code}
                            </motion.p>

                            <motion.h1
                                variants={fadeUp}
                                className="mt-4 max-w-4xl font-display text-5xl leading-[0.91] tracking-[-0.055em] text-foreground sm:text-7xl lg:text-[5.5rem]"
                            >
                                {notFound.title}
                            </motion.h1>

                            <motion.div
                                variants={fadeUp}
                                className="mt-8 max-w-2xl border-t-2 border-primary pt-6"
                            >
                                <p className="text-base leading-7 text-muted sm:text-lg sm:leading-8">
                                    {notFound.description}
                                </p>

                                <div className="mt-8">
                                    <Button to="/" color="accent">
                                        {notFound.homeAction}
                                    </Button>
                                </div>
                            </motion.div>
                        </motion.div>
                    </Container>
                </section>
            </motion.article>
        </PageShell>
    );
}

export default NotFoundPage;

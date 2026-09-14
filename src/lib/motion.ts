/**
 * Central Motion setup for the site.
 *
 * `motion` is installed; animations will be applied gradually in a later step.
 * Everything animation-related should live here so durations/easings stay
 * consistent with the site's restrained motion philosophy (see DESIGN.md).
 *
 * Usage later, e.g.:
 *   import { motion } from "motion/react";
 *   import { EASE, fadeUp } from "@/lib/motion";
 *   <motion.h1 {...fadeUp}>...</motion.h1>
 */

import type { Transition, Variants } from 'motion/react';

/** Signature easing curve for the site — smooth, editorial, no bounce. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Default transition used across the site. */
export const defaultTransition: Transition = {
    duration: 1,
    ease: EASE,
};

/** Fade in + rise slightly — the base entrance for most elements. */
export const fadeUp: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: defaultTransition },
};

/** Pure fade — for elements that shouldn't move. */
export const fade: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: defaultTransition },
};

/** Parent wrapper that staggers `fadeUp` children. */
export const staggerContainer: Variants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
};

/** Viewport config for scroll-triggered reveals (animate once, slightly early). */
export const viewportOnce = { once: true, margin: '-80px' } as const;

import { describe, expect, it } from 'vitest';

import {
    EASE,
    defaultTransition,
    fade,
    fadeUp,
    staggerContainer,
    viewportOnce,
} from './motion';

/** Target values are dynamic in motion's types; tests read them statically. */
type Target = Record<string, unknown>;

describe('motion presets', () => {
    it('uses a signature ease-out style cubic bezier', () => {
        // [x1, y1, x2, y2] — ease-out: fast start, gentle landing.
        expect(EASE).toEqual([0.22, 1, 0.36, 1]);
        expect(EASE[0]).toBeLessThan(EASE[2]);
        expect(EASE[1]).toBeGreaterThan(EASE[0]);
    });

    it('defines a 1s default transition using the signature ease', () => {
        expect(defaultTransition.duration).toBe(1);
        expect(defaultTransition.ease).toEqual(EASE);
    });

    it('fadeUp starts slightly below and fades in', () => {
        const hidden = fadeUp.hidden as Target;
        const visible = fadeUp.visible as Target;

        expect(hidden).toEqual({ opacity: 0, y: 12 });
        expect(visible.opacity).toBe(1);
        expect(visible.y).toBe(0);
    });

    it('fadeUp uses the default transition', () => {
        expect((fadeUp.visible as Target).transition).toEqual(
            defaultTransition,
        );
    });

    it('fade only animates opacity', () => {
        const hidden = fade.hidden as Target;
        const visible = fade.visible as Target;

        expect(hidden).toEqual({ opacity: 0 });
        expect(visible.opacity).toBe(1);
        expect(visible).not.toHaveProperty('y');
    });

    it('staggerContainer staggers children with a small delay', () => {
        const transition = (staggerContainer.visible as Target)
            .transition as Record<string, number>;

        expect(transition.staggerChildren).toBeGreaterThan(0);
        expect(transition.staggerChildren).toBeLessThan(0.3);
        expect(transition.delayChildren).toBeGreaterThanOrEqual(0);
    });

    it('viewportOnce triggers once, slightly before entering view', () => {
        expect(viewportOnce.once).toBe(true);
        expect(viewportOnce.margin).toContain('-');
    });
});

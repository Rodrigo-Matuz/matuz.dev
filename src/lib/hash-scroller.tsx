import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * Hash-scroll handling for the SPA.
 *
 * Native anchor behavior (`/#record`) doesn't work reliably in a client-side
 * router: on a fresh load the target section may not be mounted yet, and
 * in-page hash changes don't scroll at all. This component listens to the
 * hash and scrolls to the matching element — immediately when possible,
 * otherwise after a short retry window while the page renders.
 *
 * Mounted once inside the Router, next to the route tree.
 */
export function HashScroller() {
    const location = useLocation();

    useEffect(() => {
        if (!location.hash) {
            window.scrollTo({ top: 0 });
            return;
        }

        const id = decodeURIComponent(location.hash.slice(1));

        const scrollToId = () => {
            const element = document.getElementById(id);

            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
                return true;
            }

            return false;
        };

        // The element may not exist yet on a fresh load (page still mounting).
        if (scrollToId()) return;

        const retries = [100, 300, 700, 1200];
        const timers = retries.map((delay) =>
            window.setTimeout(() => {
                scrollToId();
            }, delay),
        );

        return () => {
            for (const timer of timers) window.clearTimeout(timer);
        };
    }, [location]);

    return null;
}

export default HashScroller;

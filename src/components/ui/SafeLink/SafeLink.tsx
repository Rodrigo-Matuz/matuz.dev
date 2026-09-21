import {
    useRef,
    useState,
    type AnchorHTMLAttributes,
    type ReactNode,
} from "react";

interface SafeLinkProps extends Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    "href" | "children"
> {
    /** The real destination — injected into the DOM only after interaction. */
    href: string;
    children: ReactNode;
    className?: string;
}

/**
 * Anti-scraping link: the `href` is absent from the initial HTML, so
 * crawlers that parse static markup never see the destination (email
 * addresses, profile URLs). The href is injected on the first hover, touch,
 * or focus — and keyboard users get Enter/Space handling, so practicality
 * is preserved for every real visitor.
 */
export function SafeLink({
    href,
    children,
    className = "",
    ...props
}: SafeLinkProps) {
    const [revealed, setRevealed] = useState(false);
    const anchorRef = useRef<HTMLAnchorElement>(null);

    const reveal = () => setRevealed(true);

    const activate = () => {
        reveal();
        // The href only exists after the state update re-renders; click on
        // the next frame so the browser follows the real destination.
        requestAnimationFrame(() => anchorRef.current?.click());
    };

    return (
        <a
            ref={anchorRef}
            href={revealed ? href : undefined}
            role={revealed ? undefined : "link"}
            tabIndex={revealed ? undefined : 0}
            onPointerEnter={reveal}
            onPointerDown={reveal}
            onTouchStart={reveal}
            onFocus={reveal}
            onKeyDown={(event) => {
                if (!revealed && (event.key === "Enter" || event.key === " ")) {
                    event.preventDefault();
                    activate();
                }
            }}
            className={className}
            {...props}
        >
            {children}
        </a>
    );
}

export default SafeLink;

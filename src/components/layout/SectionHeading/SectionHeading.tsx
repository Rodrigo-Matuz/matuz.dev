import type { ReactNode } from "react";

interface SectionHeadingProps {
    eyebrow?: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    /**
     * "stacked" renders the heading block alone.
     * "split" renders a two-column grid: eyebrow + title + description on the
     * left, `children` on the right (matching the record/experience sections).
     */
    layout?: "stacked" | "split";
    /** Optional link/button rendered after the description in the left column. */
    action?: ReactNode;
    className?: string;
    children?: ReactNode;
}

export function SectionHeading({
    eyebrow,
    title,
    description,
    layout = "stacked",
    action,
    className = "",
    children,
}: SectionHeadingProps) {
    const heading = (
        <>
            {eyebrow}
            <h2 className="mt-5 max-w-sm font-display text-4xl leading-[0.98] tracking-[-0.045em] text-foreground sm:text-5xl">
                {title}
            </h2>
            {description && (
                <p className="mt-6 max-w-sm text-sm leading-6 text-muted">
                    {description}
                </p>
            )}
            {action}
        </>
    );

    if (layout === "split") {
        return (
            <div
                className={`grid gap-12 lg:grid-cols-[0.8fr_1.6fr] lg:gap-20 ${className}`}
            >
                <div>{heading}</div>
                <div>{children}</div>
            </div>
        );
    }

    return <div className={className}>{heading}</div>;
}

export default SectionHeading;

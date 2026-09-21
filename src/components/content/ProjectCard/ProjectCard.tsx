import { ArrowUpRight } from 'lucide-react';

import BrandIcon from '$/components/ui/BrandIcon';

interface ProjectCardProps {
    title: string;
    description: string;
    /** Optional preview image, rendered as a low-contrast backdrop. */
    image?: string;
    /** Technology tags rendered as small document-like labels. */
    technologies?: string[];
    /** Link to the project's source on GitHub. */
    github?: string;
    /** Internal route to the project's expanded "About" page. */
    aboutHref?: string;
    /** Label for the About link (localized by the caller). */
    aboutLabel?: string;
    /** Optional live preview link (external URL) — only when one exists. */
    preview?: string;
    /** Label for the source link (localized by the caller). */
    sourceLabel?: string;
    /** Label for the preview link (localized by the caller). */
    previewLabel?: string;
}

/**
 * Portfolio project card — square-edged, hairline borders, restrained hover.
 * The optional image sits behind a surface wash so text always wins.
 */
export function ProjectCard({
    title,
    description,
    image,
    technologies = [],
    github,
    aboutHref,
    aboutLabel = 'About',
    preview,
    sourceLabel = 'Source',
    previewLabel = 'Demo',
}: ProjectCardProps) {
    return (
        <article
            className="
        group relative flex h-full flex-col
        overflow-hidden
        border border-border
        bg-surface

        transition-colors duration-500

        hover:border-primary/30
        hover:bg-surface-raised
      "
        >
            {image && (
                <div
                    aria-hidden="true"
                    className="
            relative shrink-0
            h-36 overflow-hidden
            border-b border-border
            sm:h-40
          "
                >
                    <img
                        src={image}
                        alt=""
                        loading="lazy"
                        className="
              absolute inset-0
              h-full w-full
              object-cover

              transition-transform duration-700

              group-hover:scale-105
            "
                    />

                    {/* Subtle top-down fade so the band blends into the card body. */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--color-surface)_0%,transparent_35%)]" />
                </div>
            )}

            <div className="relative z-10 flex h-full flex-col p-6">
                {/* Content block grows to fill the card so the footer is
                    always pinned to the bottom; tags sit at the block's
                    bottom edge, right above the separator. */}
                <div className="flex flex-1 flex-col">
                    {github ? (
                        <a
                            href={github}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`${title} — ${sourceLabel}`}
                            className="w-fit"
                        >
                            <h3
                                className="font-display text-2xl leading-tight tracking-[-0.03em] text-foreground transition-colors duration-300 group-hover:text-primary"
                            >
                                {title}
                            </h3>
                        </a>
                    ) : (
                        <h3 className="font-display text-2xl leading-tight tracking-[-0.03em] text-foreground">
                            {title}
                        </h3>
                    )}

                    <p className="mt-3 text-sm leading-6 text-muted">
                        {description}
                    </p>

                    {technologies.length > 0 && (
                        <ul
                            className="mt-auto flex flex-wrap gap-2 pt-5"
                            aria-label={title}
                        >
                            {technologies.map((technology) => (
                                <li key={technology}>
                                    <span className="inline-flex items-center border border-foreground/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-muted">
                                        {technology}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {(github || aboutHref || preview) && (
                    <div className="mt-6 flex items-center gap-5 border-t border-foreground/10 pt-4">
                        {github && (
                            <a
                                href={github}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-subtle transition-colors hover:text-primary"
                            >
                                <BrandIcon name="github" size={14} />
                                {sourceLabel}
                            </a>
                        )}

                        {aboutHref && (
                            <a
                                href={aboutHref}
                                className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-subtle transition-colors hover:text-primary"
                            >
                                {aboutLabel}
                                <ArrowUpRight
                                    size={14}
                                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                />
                            </a>
                        )}

                        {preview && (
                            <a
                                href={preview}
                                target={
                                    preview.startsWith('http')
                                        ? '_blank'
                                        : undefined
                                }
                                rel="noreferrer"
                                className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-subtle transition-colors hover:text-primary"
                            >
                                {previewLabel}
                                <ArrowUpRight
                                    size={14}
                                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                />
                            </a>
                        )}
                    </div>
                )}
            </div>
        </article>
    );
}

export default ProjectCard;

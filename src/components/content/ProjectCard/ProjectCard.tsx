import { ArrowUpRight, GitBranch } from 'lucide-react';

import Badge from '$/components/ui/Badge';

interface ProjectCardProps {
    title: string;
    description: string;
    image?: string;
    technologies?: string[];
    href?: string;
    github?: string;
}

export function ProjectCard({
    title,
    description,
    image,
    technologies = [],
    href,
    github,
}: ProjectCardProps) {
    return (
        <article
            className="
        group relative overflow-hidden
        rounded-2xl
        border border-border
        bg-surface

        transition-all duration-500

        hover:-translate-y-1
        hover:border-primary/20
        hover:shadow-[0_20px_70px_-45px_var(--color-primary)]
      "
        >
            {image && (
                <div
                    className="
            pointer-events-none
            absolute inset-0
            overflow-hidden
          "
                >
                    <img
                        src={image}
                        alt=""
                        aria-hidden="true"
                        className="
              absolute inset-0
              h-full w-full
              scale-105
              object-cover
              blur-[1px]
              opacity-45

              transition-all duration-700

              group-hover:scale-110
              group-hover:opacity-50
            "
                    />

                    {/* Horizontal fade */}
                    <div
                        className="
              absolute inset-0
              bg-gradient-to-r
              from-surface
              via-surface/90
              via-55%
              to-surface/30
            "
                    />

                    {/* Vertical integration */}
                    <div
                        className="
              absolute inset-0
              bg-gradient-to-b
              from-surface/40
              via-transparent
              to-surface/60
            "
                    />
                </div>
            )}

            <div className="relative z-10 p-6">
                <div className="flex items-start gap-4">
                    <div className="min-w-0 flex-1">
                        <h3
                            className="
                text-xl font-semibold
                tracking-tight
                text-foreground
              "
                        >
                            {title}
                        </h3>

                        <p
                            className="
                mt-2
                max-w-xl
                text-sm leading-6
                text-muted
              "
                        >
                            {description}
                        </p>
                    </div>

                    {href && (
                        <a
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`View ${title}`}
                            className="
                shrink-0
                inline-flex items-center gap-1.5
                rounded-lg
                px-3 py-2

                text-sm font-medium
                text-subtle

                transition-all duration-300

                hover:text-foreground

                group-hover:text-primary
                group-hover:drop-shadow-[0_0_8px_color-mix(in_srgb,var(--color-primary)_35%,transparent)]
              "
                        >
                            View
                            <ArrowUpRight
                                size={16}
                                className="
                  transition-transform duration-300

                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                "
                            />
                        </a>
                    )}
                </div>

                {technologies.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                        {technologies.map((technology) => (
                            <Badge key={technology}>{technology}</Badge>
                        ))}
                    </div>
                )}

                {github && (
                    <a
                        href={github}
                        target="_blank"
                        rel="noreferrer"
                        className="
              mt-6
              inline-flex items-center gap-2

              text-sm font-medium
              text-subtle

              transition-all duration-300

              hover:text-foreground

              group-hover:text-muted
              group-hover:drop-shadow-[0_0_8px_color-mix(in_srgb,var(--color-primary)_35%,transparent)]
            "
                    >
                        <GitBranch
                            size={16}
                            className="
                transition-colors duration-300
                group-hover:text-primary
              "
                        />
                        Source
                    </a>
                )}
            </div>
        </article>
    );
}

export default ProjectCard;

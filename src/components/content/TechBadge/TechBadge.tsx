import type { ReactNode } from 'react';

import { ArrowUpRight } from 'lucide-react';

interface TechBadgeProps {
    name: string;
    icon?: ReactNode;
    description?: string;
    href?: string;
}

export function TechBadge({ name, icon, description, href }: TechBadgeProps) {
    const content = (
        <>
            <span
                className="
          flex size-10
          shrink-0
          items-center justify-center
          rounded-xl
          bg-foreground/5
          text-muted

          transition-colors duration-300

          group-hover:text-foreground
        "
            >
                {icon ?? name.charAt(0)}
            </span>

            <span className="min-w-0">
                <span
                    className="
            block
            text-sm font-medium
            text-foreground
          "
                >
                    {name}
                </span>

                {description && (
                    <span
                        className="
              mt-0.5
              block truncate
              text-xs
              text-subtle
            "
                    >
                        {description}
                    </span>
                )}
            </span>

            {href && (
                <ArrowUpRight
                    size={15}
                    className="
            ml-auto
            shrink-0

            text-subtle

            transition-all duration-300

            group-hover:-translate-y-0.5
            group-hover:translate-x-0.5
            group-hover:text-primary
            group-hover:drop-shadow-[0_0_8px_color-mix(in_srgb,var(--color-primary)_35%,transparent)]
          "
                />
            )}
        </>
    );

    const classes = `
    group flex items-center gap-3
    rounded-xl
    border border-border
    bg-surface
    p-2

    transition-all duration-200

    hover:border-primary/15
    hover:bg-surface-raised
  `;

    if (href) {
        return (
            <a href={href} target="_blank" rel="noreferrer" className={classes}>
                {content}
            </a>
        );
    }

    return <div className={classes}>{content}</div>;
}

export default TechBadge;

import type { ReactNode } from "react";

import { ArrowUpRight } from "lucide-react";

interface SocialLinkProps {
    name: string;
    handle?: string;
    icon: ReactNode;
    href: string;
}

export function SocialLink({ name, handle, icon, href }: SocialLinkProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="
        group flex items-center gap-4
        rounded-2xl
        border border-border
        bg-surface
        p-4

        transition-all duration-300

        hover:-translate-y-0.5
        hover:border-primary/20
        hover:bg-surface-raised
      "
        >
            <span
                className="
          flex size-11
          shrink-0
          items-center justify-center
          rounded-xl
          bg-foreground/5
          text-muted

          transition-colors duration-300

          group-hover:text-foreground
        "
            >
                {icon}
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

                {handle && (
                    <span
                        className="
              block
              text-xs
              text-subtle
            "
                    >
                        {handle}
                    </span>
                )}
            </span>

            <ArrowUpRight
                size={16}
                className="
          ml-auto

          text-subtle

          transition-all duration-300

          group-hover:-translate-y-0.5
          group-hover:translate-x-0.5
          group-hover:text-primary
          group-hover:drop-shadow-[0_0_8px_color-mix(in_srgb,var(--color-primary)_35%,transparent)]
        "
            />
        </a>
    );
}

export default SocialLink;

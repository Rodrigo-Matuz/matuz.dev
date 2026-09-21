import type { ReactNode } from "react";

type BadgeVariant =
    "default" | "blue" | "purple" | "red" | "orange" | "yellow" | "green";

interface BadgeProps {
    children: ReactNode;
    variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, string> = {
    default: `
    bg-foreground/5
    text-muted
    border-foreground/10
  `,

    blue: `
    bg-primary/10
    text-primary
    border-primary/20
  `,

    purple: `
    bg-secondary/10
    text-secondary
    border-secondary/20
  `,

    red: `
    bg-accent/10
    text-accent
    border-accent/20
  `,

    orange: `
    bg-warning/10
    text-warning
    border-warning/20
  `,

    yellow: `
    bg-highlight/10
    text-highlight
    border-highlight/20
  `,

    green: `
    bg-success/10
    text-success
    border-success/20
  `,
};

export function Badge({ children, variant = "default" }: BadgeProps) {
    return (
        <span
            className={`
        inline-flex items-center
        rounded-full border
        px-2.5 py-1
        text-xs font-medium

        ${variants[variant]}
      `}
        >
            {children}
        </span>
    );
}

export default Badge;

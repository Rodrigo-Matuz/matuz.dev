import type { ReactNode } from "react";

export type EyebrowColor =
    "primary" | "secondary" | "accent" | "warning" | "success" | "highlight";

const colorStyles: Record<EyebrowColor, string> = {
    primary: "text-primary",
    secondary: "text-secondary",
    accent: "text-accent",
    warning: "text-warning",
    success: "text-success",
    highlight: "text-highlight",
};

const lineStyles: Record<EyebrowColor, string> = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    accent: "bg-accent",
    warning: "bg-warning",
    success: "bg-success",
    highlight: "bg-highlight",
};

interface EyebrowProps {
    children: ReactNode;
    color?: EyebrowColor;
    line?: boolean;
    className?: string;
}

export function Eyebrow({
    children,
    color = "primary",
    line = false,
    className = "",
}: EyebrowProps) {
    return (
        <p
            className={`inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] sm:text-xs ${colorStyles[color]} ${className}`}
        >
            {line && (
                <span
                    aria-hidden="true"
                    className={`h-px w-8 ${lineStyles[color]}`}
                />
            )}

            <span>{children}</span>
        </p>
    );
}

export default Eyebrow;

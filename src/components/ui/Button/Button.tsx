import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { Link } from "react-router";

import { LoaderCircle } from "lucide-react";

type ButtonColor = "accent" | "primary" | "outline";

const colorStyles: Record<ButtonColor, string> = {
    accent: "bg-accent text-white hover:bg-accent/85",
    primary: "bg-primary text-white hover:bg-primary/85",
    outline:
        "border border-foreground/15 text-foreground hover:border-success hover:text-success",
};

const baseStyles = `
    group inline-flex items-center gap-2
    px-5 py-3
    text-xs font-semibold uppercase tracking-[0.14em]
    transition-colors
    disabled:pointer-events-none disabled:opacity-50
`;

type AnchorOnlyProps = Pick<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    "target" | "referrerPolicy"
>;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
    AnchorOnlyProps & {
        /** When set, the button renders as an anchor element. */
        href?: string;
        /**
         * Internal route path — renders a react-router `Link` (client-side
         * navigation with page transitions). Takes precedence over `href`.
         */
        to?: string;
        color?: ButtonColor;
        loading?: boolean;
        className?: string;
    };

export function Button({
    children,
    color = "accent",
    className = "",
    href,
    to,
    loading = false,
    disabled,
    type,
    ...props
}: ButtonProps) {
    const classes = `${baseStyles} ${colorStyles[color]} ${className}`;

    if (to !== undefined) {
        return (
            <Link to={to} className={classes} {...(props as AnchorOnlyProps)}>
                {children}
            </Link>
        );
    }

    if (href !== undefined) {
        return (
            <a href={href} className={classes} {...(props as AnchorOnlyProps)}>
                {children}
            </a>
        );
    }

    return (
        <button
            type={type ?? "button"}
            disabled={disabled || loading}
            className={classes}
            {...props}
        >
            {loading && <LoaderCircle size={15} className="animate-spin" />}

            {children}
        </button>
    );
}

export default Button;

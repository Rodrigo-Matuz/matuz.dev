import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router';

import { ArrowDownRight } from 'lucide-react';

type ArrowLinkHover = 'primary' | 'accent' | 'secondary' | 'success';

const hoverStyles: Record<ArrowLinkHover, string> = {
    primary: 'hover:text-primary',
    accent: 'hover:text-accent',
    secondary: 'hover:text-secondary',
    success: 'hover:text-success',
};

interface ArrowLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
    children: ReactNode;
    hover?: ArrowLinkHover;
    /**
     * Internal route path — renders a react-router `Link` (client-side
     * navigation with page transitions). `href` still renders a plain anchor.
     */
    to?: string;
    href?: string;
}

export function ArrowLink({
    children,
    hover = 'primary',
    className = '',
    to,
    href,
    ...props
}: ArrowLinkProps) {
    const classes = `group inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors ${hoverStyles[hover]} ${className}`;

    if (to !== undefined) {
        return (
            <Link to={to} className={classes} {...props}>
                {children}
                <ArrowDownRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                />
            </Link>
        );
    }

    return (
        <a href={href} className={classes} {...props}>
            {children}
            <ArrowDownRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"
            />
        </a>
    );
}

export default ArrowLink;

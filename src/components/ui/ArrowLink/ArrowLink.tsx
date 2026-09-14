import type { AnchorHTMLAttributes, ReactNode } from 'react';

import { ArrowDownRight } from 'lucide-react';

type ArrowLinkHover = 'primary' | 'accent' | 'secondary' | 'success';

const hoverStyles: Record<ArrowLinkHover, string> = {
    primary: 'hover:text-primary',
    accent: 'hover:text-accent',
    secondary: 'hover:text-secondary',
    success: 'hover:text-success',
};

interface ArrowLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    children: ReactNode;
    hover?: ArrowLinkHover;
}

export function ArrowLink({
    children,
    hover = 'primary',
    className = '',
    ...props
}: ArrowLinkProps) {
    return (
        <a
            className={`group inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors ${hoverStyles[hover]} ${className}`}
            {...props}
        >
            {children}

            <ArrowDownRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"
            />
        </a>
    );
}

export default ArrowLink;

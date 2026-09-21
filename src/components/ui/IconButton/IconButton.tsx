import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    label: string;
}

export function IconButton({
    children,
    label,
    className = '',
    ...props
}: IconButtonProps) {
    return (
        <button
            aria-label={label}
            title={label}
            className={`
        inline-flex size-10
        items-center justify-center

        rounded-xl
        border border-border
        bg-surface

        text-muted

        transition-all duration-200

        hover:-translate-y-0.5
        hover:border-foreground/15
        hover:bg-surface-raised
        hover:text-foreground

        active:translate-y-0

        ${className}
      `}
            {...props}
        >
            {children}
        </button>
    );
}

export default IconButton;

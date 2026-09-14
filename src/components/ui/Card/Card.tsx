import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    interactive?: boolean;
}

export function Card({
    children,
    interactive = false,
    className = '',
    ...props
}: CardProps) {
    return (
        <div
            className={`
        rounded-2xl
        border border-border
        bg-surface
        p-6

        shadow-[0_20px_60px_-40px_var(--color-background)]

        ${
            interactive
                ? `
              transition-all duration-300

              hover:-translate-y-1
              hover:border-foreground/12
              hover:bg-surface-raised
            `
                : ''
        }

        ${className}
      `}
            {...props}
        >
            {children}
        </div>
    );
}

export default Card;

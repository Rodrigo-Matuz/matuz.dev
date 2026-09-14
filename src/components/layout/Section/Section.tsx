import type { HTMLAttributes } from 'react';

interface SectionProps extends HTMLAttributes<HTMLElement> {
    id?: string;
    /**
     * Band treatment for alternating sections:
     * - `true`: blurred band (bg-background/75)
     * - `"soft"`: more transparent band (bg-background/40) for lower-contrast sections
     */
    band?: boolean | 'soft';
}

const bandStyles = {
    true: 'border-y border-foreground/10 bg-background/75 backdrop-blur-md',
    soft: 'border-y border-foreground/10 bg-background/40 backdrop-blur-md',
};

export function Section({
    children,
    className = '',
    band = false,
    ...props
}: SectionProps) {
    return (
        <section
            className={`
        relative
        ${band ? bandStyles[String(band) as 'true' | 'soft'] : ''}
        ${className}
      `}
            {...props}
        >
            {children}
        </section>
    );
}

export default Section;

import type { HTMLAttributes } from 'react';

interface SectionProps extends HTMLAttributes<HTMLElement> {
    id?: string;
    /**
     * Band treatment for alternating sections:
     * - `true`: solid band (bg-background)
     * - `"soft"`: solid raised band (bg-surface) for lower-contrast sections
     */
    band?: boolean | 'soft';
}

const bandStyles = {
    true: 'border-y border-foreground/10 bg-background',
    soft: 'border-y border-foreground/10 bg-surface',
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
        relative scroll-mt-24
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

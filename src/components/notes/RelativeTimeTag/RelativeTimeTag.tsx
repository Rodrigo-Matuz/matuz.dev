import { useLanguage } from '$/lib/language';
import { formatRelativeTime, parseTimestamp } from '$/lib/relative-time';

interface RelativeTimeTagProps {
    /** `YYYY-MM-DDTHH:mm` timestamp, or null when missing. */
    timestamp: string | null;
    /** Label prefix, e.g. "Updated". */
    label: string;
    className?: string;
}

/**
 * "Updated 2d ago" style tag in the site's mono/subtle vocabulary.
 * Hovering reveals the exact date/time via a custom tooltip styled to match
 * the site (dark surface, mono, uppercase, subtle border).
 * Renders nothing when the timestamp is missing or malformed.
 */
export function RelativeTimeTag({
    timestamp,
    label,
    className = '',
}: RelativeTimeTagProps) {
    const language = useLanguage();
    const date = parseTimestamp(timestamp);

    if (!date) return null;

    const absolute = date.toLocaleString(language, {
        dateStyle: 'medium',
        timeStyle: 'short',
    });

    return (
        <span
            className={`group relative inline-flex items-center ${className}`}
            aria-label={`${label}: ${absolute}`}
        >
            <span
                className="font-mono text-[10px] uppercase tracking-[0.14em] text-subtle"
                aria-hidden="true"
            >
                {label} {formatRelativeTime(date, language)}
            </span>
            <span
                className="
                    absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                    px-2 py-1
                    bg-surface border border-border text-foreground
                    font-mono text-[10px] uppercase tracking-[0.14em] text-center
                    whitespace-nowrap rounded
                    opacity-0 group-hover:opacity-100 group-focus-within:opacity-100
                    transition-opacity duration-150 pointer-events-none z-10
                "
            >
                {label}: {absolute}
            </span>
        </span>
    );
}

export default RelativeTimeTag;

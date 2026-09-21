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
 * Hovering reveals the exact date/time via a native tooltip.
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
            title={`${label}: ${absolute}`}
            className={`font-mono text-[10px] uppercase tracking-[0.14em] text-subtle ${className}`}
        >
            {label} {formatRelativeTime(date, language)}
        </span>
    );
}

export default RelativeTimeTag;

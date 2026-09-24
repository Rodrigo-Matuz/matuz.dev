/**
 * Relative-time formatting for the "updated 2d ago" tag.
 *
 * Uses the native Intl.RelativeTimeFormat, picking the best unit:
 * minutes → hours → days → weeks → months → years.
 */

const UNITS: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
    { unit: 'year', seconds: 31557600 },
    { unit: 'month', seconds: 2629800 },
    { unit: 'week', seconds: 604800 },
    { unit: 'day', seconds: 86400 },
    { unit: 'hour', seconds: 3600 },
    { unit: 'minute', seconds: 60 },
];

/** Parse a `YYYY-MM-DDTHH:mm` local timestamp; returns null when invalid. */
export function parseTimestamp(value: string | null): Date | null {
    if (!value) return null;

    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
}

/** Format a past timestamp as a relative time string ("2 days ago"). */
export function formatRelativeTime(
    date: Date,
    locale: string,
    now: Date = new Date(),
): string {
    const formatter = new Intl.RelativeTimeFormat(locale, {
        numeric: 'always',
    });
    const diffSeconds = Math.round((date.getTime() - now.getTime()) / 1000);
    const absolute = Math.abs(diffSeconds);

    for (const { unit, seconds } of UNITS) {
        if (absolute >= seconds) {
            return formatter.format(Math.round(diffSeconds / seconds), unit);
        }
    }

    return formatter.format(Math.round(diffSeconds / 60), 'minute');
}

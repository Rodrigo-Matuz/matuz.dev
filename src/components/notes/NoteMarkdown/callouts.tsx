import type { ReactNode } from 'react';
import { AlertTriangle, Flame, Info, Lightbulb, Pencil } from 'lucide-react';

/**
 * Obsidian-style callouts: blockquotes whose first line is
 * `> [!type] optional title` (optionally followed by `-` for collapsed or
 * `+` for expanded fold state). Rendered as a colored panel with an icon.
 */

export interface CalloutStyle {
    /** Tailwind classes for the panel container. */
    panel: string;
    /** Tailwind classes for the icon. */
    icon: string;
    /** Lucide icon component. */
    Icon: typeof Info;
    /** Default title when the callout has none. */
    fallbackTitle: string;
}

export const CALLOUT_STYLES: Record<string, CalloutStyle> = {
    note: {
        panel: 'border-cyan-400/40 bg-cyan-400/5',
        icon: 'text-cyan-400',
        Icon: Info,
        fallbackTitle: 'Note',
    },
    info: {
        panel: 'border-cyan-400/40 bg-cyan-400/5',
        icon: 'text-cyan-400',
        Icon: Info,
        fallbackTitle: 'Info',
    },
    abstract: {
        panel: 'border-teal-400/40 bg-teal-400/5',
        icon: 'text-teal-400',
        Icon: Pencil,
        fallbackTitle: 'Abstract',
    },
    tip: {
        panel: 'border-emerald-400/40 bg-emerald-400/5',
        icon: 'text-emerald-400',
        Icon: Lightbulb,
        fallbackTitle: 'Tip',
    },
    success: {
        panel: 'border-emerald-400/40 bg-emerald-400/5',
        icon: 'text-emerald-400',
        Icon: Lightbulb,
        fallbackTitle: 'Success',
    },
    question: {
        panel: 'border-yellow-400/40 bg-yellow-400/5',
        icon: 'text-yellow-400',
        Icon: Pencil,
        fallbackTitle: 'Question',
    },
    warning: {
        panel: 'border-orange-400/40 bg-orange-400/5',
        icon: 'text-orange-400',
        Icon: AlertTriangle,
        fallbackTitle: 'Warning',
    },
    caution: {
        panel: 'border-orange-400/40 bg-orange-400/5',
        icon: 'text-orange-400',
        Icon: AlertTriangle,
        fallbackTitle: 'Caution',
    },
    danger: {
        panel: 'border-red-400/40 bg-red-400/5',
        icon: 'text-red-400',
        Icon: Flame,
        fallbackTitle: 'Danger',
    },
    error: {
        panel: 'border-red-400/40 bg-red-400/5',
        icon: 'text-red-400',
        Icon: Flame,
        fallbackTitle: 'Error',
    },
    bug: {
        panel: 'border-red-400/40 bg-red-400/5',
        icon: 'text-red-400',
        Icon: Flame,
        fallbackTitle: 'Bug',
    },
    example: {
        panel: 'border-purple-400/40 bg-purple-400/5',
        icon: 'text-purple-400',
        Icon: Pencil,
        fallbackTitle: 'Example',
    },
    quote: {
        panel: 'border-zinc-400/40 bg-zinc-400/5',
        icon: 'text-zinc-400',
        Icon: Pencil,
        fallbackTitle: 'Quote',
    },
};

export const DEFAULT_CALLOUT: CalloutStyle = {
    panel: 'border-foreground/20 bg-foreground/5',
    icon: 'text-foreground',
    Icon: Info,
    fallbackTitle: 'Note',
};

/** Match `> [!type] title` (with optional `-`/`+` fold marker). */
const CALLOUT_HEADER = /^\[!(\w+)\]([+-])?\s*(.*)$/;

export interface ParsedCallout {
    style: CalloutStyle;
    title: string;
    /** `-` collapses, `+` expands; undefined means not foldable. */
    fold: '-' | '+' | undefined;
}

/** Parse a callout header line; null when the blockquote is not a callout. */
export function parseCalloutHeader(firstLine: string): ParsedCallout | null {
    const match = firstLine.match(CALLOUT_HEADER);

    if (!match) return null;

    const style = CALLOUT_STYLES[match[1].toLowerCase()] ?? DEFAULT_CALLOUT;

    return {
        style,
        title: match[3].trim() || style.fallbackTitle,
        fold: match[2] as '-' | '+' | undefined,
    };
}

/** Render a callout panel given its style, title, and body content. */
export function renderCallout(
    callout: ParsedCallout,
    body: ReactNode,
): ReactNode {
    const { style, title, fold } = callout;
    const { Icon } = style;

    const header = (
        <span className={`flex items-center gap-2 font-semibold ${style.icon}`}>
            <Icon size={16} className="shrink-0" />
            {title}
        </span>
    );

    if (fold) {
        return (
            <details
                open={fold === '+'}
                className={`mt-6 rounded-sm border px-4 py-3 first:mt-0 ${style.panel}`}
            >
                <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                    {header}
                </summary>
                <div className="mt-2 text-muted">{body}</div>
            </details>
        );
    }

    return (
        <div
            className={`mt-6 rounded-sm border px-4 py-3 first:mt-0 ${style.panel}`}
        >
            {header}
            <div className="mt-2 text-muted">{body}</div>
        </div>
    );
}

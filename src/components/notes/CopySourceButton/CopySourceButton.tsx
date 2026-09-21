import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';

import { useLocale } from '$/lib/language';

interface CopySourceButtonProps {
    /** The full raw Markdown source of the note. */
    content: string;
    /** Note title, used in the accessible label. */
    title: string;
}

type CopyState = 'idle' | 'copied' | 'failed';

/**
 * "Copy source" — puts the note's entire raw Markdown (the .md file source,
 * exactly as stored in the vault) on the user's clipboard. Falls back to a
 * hidden-textarea execCommand copy when the async Clipboard API is
 * unavailable (older browsers, non-secure contexts).
 */
export function CopySourceButton({ content, title }: CopySourceButtonProps) {
    const content_ = useLocale();
    const [state, setState] = useState<CopyState>('idle');
    const resetTimer = useRef<number | undefined>(undefined);

    useEffect(() => () => window.clearTimeout(resetTimer.current), []);

    const copyWithFallback = useCallback(async (): Promise<boolean> => {
        try {
            await navigator.clipboard.writeText(content);

            return true;
        } catch {
            // Fallback for non-secure contexts / missing Clipboard API.
            try {
                const textarea = document.createElement('textarea');

                textarea.value = content;
                textarea.setAttribute('readonly', '');
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();

                const ok = document.execCommand('copy');

                document.body.removeChild(textarea);

                return ok;
            } catch {
                return false;
            }
        }
    }, [content]);

    const handleCopy = useCallback(async () => {
        const ok = await copyWithFallback();

        setState(ok ? 'copied' : 'failed');
        window.clearTimeout(resetTimer.current);
        resetTimer.current = window.setTimeout(() => setState('idle'), 2000);
    }, [copyWithFallback]);

    const label =
        state === 'copied'
            ? content_.notes.copied
            : state === 'failed'
              ? content_.notes.copyFailed
              : content_.notes.copySource;

    return (
        <button
            type="button"
            onClick={handleCopy}
            aria-label={`${label} — ${title}`}
            className={`inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
                state === 'copied'
                    ? 'border-success/40 text-success'
                    : state === 'failed'
                      ? 'border-accent/40 text-accent'
                      : 'border-foreground/10 text-subtle hover:border-foreground/25 hover:text-foreground'
            }`}
        >
            {state === 'copied' ? (
                <Check size={12} aria-hidden="true" />
            ) : (
                <Copy size={12} aria-hidden="true" />
            )}
            {label}
        </button>
    );
}

export default CopySourceButton;

import type { ReactNode } from 'react';

// The notes pipeline is code-split (lazy-loaded from App.tsx): KaTeX + the
// highlight theme live in this chunk so visitors of the other pages never
// download them.
import 'katex/dist/katex.min.css';
import './hljs-theme.css';

import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import remarkDeflist from 'remark-deflist';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { CALLOUT_STYLES, DEFAULT_CALLOUT } from './callouts';

interface NoteMarkdownProps {
    content: string;
}

/**
 * Strip Obsidian `%% comments %%` before parsing — they are author notes
 * that must never appear in reading view.
 */
function stripComments(markdown: string): string {
    return markdown.replace(/%%[\s\S]*?%%/g, '');
}

/**
 * Convert Obsidian `==highlight==` into <mark> elements (GFM has no native
 * highlight syntax). Content inside is preserved verbatim.
 */
function preprocessHighlights(markdown: string): string {
    return markdown.replace(/==([^=\n]+)==/g, '<mark>$1</mark>');
}

/**
 * Preprocess Obsidian callouts into GFM-compatible HTML the renderer can
 * style: `> [!type] title` blockquotes become <details>/<div> panels.
 * Done as a string transform because remark has no native callout syntax.
 */
function preprocessCallouts(markdown: string): string {
    const lines = markdown.split('\n');
    const out: string[] = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];
        // Fold marker sits AFTER the closing bracket: [!tip]- / [!danger]+
        const calloutMatch = line.match(/^>\s?\[!(\w+)\]([+-])?\s*(.*)$/);

        if (!calloutMatch) {
            out.push(line);
            i += 1;
            continue;
        }

        // Collect the whole blockquote block.
        const block: string[] = [];

        while (i < lines.length && lines[i].startsWith('>')) {
            block.push(lines[i].replace(/^>\s?/, ''));
            i += 1;
        }

        const [, type, fold, title] = calloutMatch;
        const body = block.slice(1).join('\n');
        const isFoldable = fold !== undefined;
        const openAttr = fold === '+' ? ' open' : '';

        out.push(
            isFoldable
                ? `<details data-callout="${type}" data-callout-title="${title}"${openAttr}>\n<summary>${title}</summary>\n\n${body}\n\n</details>`
                : `<div data-callout="${type}" data-callout-title="${title}">\n\n${body}\n\n</div>`,
        );
        out.push('');
    }

    return out.join('\n');
}

/** Extract a YouTube video ID from common URL shapes; null when not YouTube. */
function youtubeId(href: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
        /(?:youtu\.be\/)([\w-]{11})/,
        /(?:youtube\.com\/embed\/)([\w-]{11})/,
        /(?:youtube\.com\/shorts\/)([\w-]{11})/,
    ];

    for (const pattern of patterns) {
        const match = href.match(pattern);

        if (match) return match[1];
    }

    return null;
}

/**
 * Markdown renderer for notes, mapped to the site's typography with a
 * colorful editorial palette. Supports GFM (tables, task lists,
 * strikethrough, footnotes), Obsidian callouts, LaTeX math (KaTeX),
 * definition lists, inline HTML, hidden %% comments %% and YouTube embeds.
 * Code blocks use the Sweet Dracula Monokai theme.
 */
export function NoteMarkdown({ content }: NoteMarkdownProps): ReactNode {
    const processed = preprocessCallouts(
        preprocessHighlights(stripComments(content)),
    );

    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath, remarkDeflist]}
            rehypePlugins={[
                rehypeSlug,
                rehypeKatex,
                rehypeHighlight,
                rehypeRaw,
            ]}
            components={{
                // Callout panels (from the preprocessor) — styled by type.
                div: ({ node, children, ...props }) => {
                    const type = (
                        node as unknown as {
                            properties?: { dataCallout?: string };
                        }
                    ).properties?.dataCallout;

                    if (!type) return <div {...props}>{children}</div>;

                    const title = (
                        node as unknown as {
                            properties?: { dataCalloutTitle?: string };
                        }
                    ).properties?.dataCalloutTitle;
                    const style = CALLOUT_STYLES[type] ?? DEFAULT_CALLOUT;
                    const { Icon } = style;

                    return (
                        <div
                            {...props}
                            className={`mt-6 rounded-sm border px-4 py-3 first:mt-0 ${style.panel}`}
                        >
                            <span
                                className={`flex items-center gap-2 font-semibold ${style.icon}`}
                            >
                                <Icon size={16} className="shrink-0" />
                                {title}
                            </span>
                            <div className="mt-2 [&>p]:mt-0">{children}</div>
                        </div>
                    );
                },
                details: ({ node, children, ...props }) => {
                    const type = (
                        node as unknown as {
                            properties?: { dataCallout?: string };
                        }
                    ).properties?.dataCallout;

                    if (!type) return <details {...props}>{children}</details>;

                    const title = (
                        node as unknown as {
                            properties?: { dataCalloutTitle?: string };
                        }
                    ).properties?.dataCalloutTitle;
                    const style = CALLOUT_STYLES[type] ?? DEFAULT_CALLOUT;
                    const { Icon } = style;

                    return (
                        <details
                            {...props}
                            className={`mt-6 rounded-sm border px-4 py-3 first:mt-0 ${style.panel}`}
                        >
                            <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                                <span
                                    className={`flex items-center gap-2 font-semibold ${style.icon}`}
                                >
                                    <Icon size={16} className="shrink-0" />
                                    {title}
                                </span>
                            </summary>
                            <div className="mt-2 [&>p]:mt-0">{children}</div>
                        </details>
                    );
                },
                h1: ({ children }) => (
                    <h1 className="mt-10 font-display text-2xl tracking-[-0.03em] text-success first:mt-0">
                        {children}
                    </h1>
                ),
                h2: ({ children }) => (
                    <h2 className="mt-8 font-display text-xl tracking-[-0.02em] text-accent">
                        {children}
                    </h2>
                ),
                h3: ({ children }) => (
                    <h3 className="mt-6 font-display text-lg text-warning">
                        {children}
                    </h3>
                ),
                h4: ({ children }) => (
                    <h4 className="mt-6 font-display text-base text-highlight">
                        {children}
                    </h4>
                ),
                h5: ({ children }) => (
                    <h5 className="mt-6 font-display text-base text-secondary">
                        {children}
                    </h5>
                ),
                h6: ({ children }) => (
                    <h6 className="mt-6 font-mono text-xs uppercase tracking-[0.14em] text-subtle">
                        {children}
                    </h6>
                ),
                p: ({ children }) => (
                    <p className="mt-4 text-base leading-7 text-muted first:mt-0">
                        {children}
                    </p>
                ),
                strong: ({ children }) => (
                    <strong className="font-semibold text-primary">
                        {children}
                    </strong>
                ),
                em: ({ children }) => (
                    <em className="text-muted italic">{children}</em>
                ),
                mark: ({ children }) => (
                    <mark className="rounded-sm bg-highlight/25 px-1 text-highlight">
                        {children}
                    </mark>
                ),
                del: ({ children }) => (
                    <del className="text-subtle">{children}</del>
                ),
                a: ({ children, href }) => {
                    const id = href ? youtubeId(href) : null;

                    if (id) {
                        return (
                            <span className="mt-6 block aspect-video w-full overflow-hidden rounded-sm border border-foreground/10">
                                <iframe
                                    src={`https://www.youtube-nocookie.com/embed/${id}`}
                                    title="YouTube video"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    loading="lazy"
                                    className="h-full w-full"
                                />
                            </span>
                        );
                    }

                    return (
                        <a
                            href={href}
                            target={
                                href?.startsWith('http') ? '_blank' : undefined
                            }
                            rel="noreferrer"
                            className="text-success underline decoration-success/40 underline-offset-4 transition-colors hover:decoration-success"
                        >
                            {children}
                        </a>
                    );
                },
                ul: ({ children }) => (
                    <ul className="mt-4 list-disc space-y-1 pl-6 text-base leading-7 text-muted marker:text-success [&_input[type='checkbox']]:mr-2 [&_input[type='checkbox']]:align-middle [&_input[type='checkbox']]:accent-emerald-400">
                        {children}
                    </ul>
                ),
                ol: ({ children }) => (
                    <ol className="mt-4 list-decimal space-y-1 pl-6 text-base leading-7 text-muted marker:text-accent">
                        {children}
                    </ol>
                ),
                li: ({ children }) => (
                    <li className="[&>p]:m-0 [&>input[type='checkbox']:checked~*]:text-subtle">
                        {children}
                    </li>
                ),
                dl: ({ children }) => (
                    <dl className="mt-4 space-y-2 text-base text-muted">
                        {children}
                    </dl>
                ),
                dt: ({ children }) => (
                    <dt className="font-semibold text-foreground">
                        {children}
                    </dt>
                ),
                dd: ({ children }) => (
                    <dd className="ml-6 border-l border-foreground/10 pl-4">
                        {children}
                    </dd>
                ),
                section: ({ children, ...props }) => {
                    // Footnote sections from remark-gfm.
                    const className = (props as { className?: string })
                        .className;

                    if (className?.includes('footnotes')) {
                        return (
                            <section
                                {...props}
                                className="mt-10 border-t border-foreground/10 pt-4 text-sm text-subtle"
                            >
                                {children}
                            </section>
                        );
                    }

                    return <section {...props}>{children}</section>;
                },
                blockquote: ({ children }) => (
                    <blockquote className="mt-6 border-l-2 border-warning pl-4 text-warning/90 italic">
                        {children}
                    </blockquote>
                ),
                code: ({ className, children }) => {
                    const isBlock = className?.includes('language-');

                    if (isBlock) {
                        return (
                            <code className="block overflow-x-auto rounded-sm bg-foreground/5 p-4 font-mono text-sm leading-6 text-foreground">
                                {children}
                            </code>
                        );
                    }

                    return (
                        <code className="rounded-sm bg-foreground/10 px-1.5 py-0.5 font-mono text-[0.85em] text-primary">
                            {children}
                        </code>
                    );
                },
                pre: ({ children }) => <pre className="mt-6">{children}</pre>,
                table: ({ children }) => (
                    <div className="mt-6 overflow-x-auto">
                        <table className="w-full border-collapse text-sm text-muted">
                            {children}
                        </table>
                    </div>
                ),
                th: ({ children }) => (
                    <th className="border-b border-foreground/20 px-3 py-2 text-left font-mono text-[10px] uppercase tracking-[0.14em] text-success">
                        {children}
                    </th>
                ),
                td: ({ children }) => (
                    <td className="border-b border-foreground/10 px-3 py-2">
                        {children}
                    </td>
                ),
                img: ({ alt, src }) => (
                    <img
                        src={src}
                        alt={alt ?? ''}
                        loading="lazy"
                        className="mt-6 rounded-sm border border-foreground/10"
                    />
                ),
                hr: () => <hr className="mt-8 border-foreground/10" />,
            }}
        >
            {processed}
        </ReactMarkdown>
    );
}

export default NoteMarkdown;

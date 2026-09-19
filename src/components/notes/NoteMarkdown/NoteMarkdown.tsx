import type { ReactNode } from 'react';

import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

interface NoteMarkdownProps {
    content: string;
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
 * colorful editorial palette (headings, bold, links, inline code each get
 * their own accent — dark-blue background, so blues/purples are avoided
 * except for inline code, which sits on a gray chip).
 *
 * GFM (tables, task lists, strikethrough) is enabled; headings get slug
 * anchors; code blocks use the Sweet Dracula Monokai theme; YouTube links
 * become embeds.
 */
export function NoteMarkdown({ content }: NoteMarkdownProps): ReactNode {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSlug, rehypeHighlight]}
            components={{
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
                    <strong className="font-semibold text-foreground">
                        {children}
                    </strong>
                ),
                em: ({ children }) => (
                    <em className="text-highlight italic">{children}</em>
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
                            target={href?.startsWith('http') ? '_blank' : undefined}
                            rel="noreferrer"
                            className="text-success underline decoration-success/40 underline-offset-4 transition-colors hover:decoration-success"
                        >
                            {children}
                        </a>
                    );
                },
                ul: ({ children }) => (
                    <ul className="mt-4 list-disc space-y-1 pl-6 text-base leading-7 text-muted marker:text-success">
                        {children}
                    </ul>
                ),
                ol: ({ children }) => (
                    <ol className="mt-4 list-decimal space-y-1 pl-6 text-base leading-7 text-muted marker:text-accent">
                        {children}
                    </ol>
                ),
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
                        <code className="rounded-sm bg-foreground/10 px-1.5 py-0.5 font-mono text-[0.85em] text-highlight">
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
            {content}
        </ReactMarkdown>
    );
}

export default NoteMarkdown;

import type { ReactNode } from 'react';

import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

interface NoteMarkdownProps {
    content: string;
}

/**
 * Markdown renderer for notes, mapped to the site's typography.
 * GFM (tables, task lists, strikethrough) is enabled; headings get slug
 * anchors; code blocks are highlighted with rehype-highlight (github-dark
 * theme imported in index.css).
 */
export function NoteMarkdown({ content }: NoteMarkdownProps): ReactNode {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSlug, rehypeHighlight]}
            components={{
                h1: ({ children }) => (
                    <h1 className="mt-10 font-display text-2xl tracking-[-0.03em] text-foreground first:mt-0">
                        {children}
                    </h1>
                ),
                h2: ({ children }) => (
                    <h2 className="mt-8 font-display text-xl tracking-[-0.02em] text-foreground">
                        {children}
                    </h2>
                ),
                h3: ({ children }) => (
                    <h3 className="mt-6 font-display text-lg text-foreground">
                        {children}
                    </h3>
                ),
                p: ({ children }) => (
                    <p className="mt-4 text-base leading-7 text-muted first:mt-0">
                        {children}
                    </p>
                ),
                a: ({ children, href }) => (
                    <a
                        href={href}
                        target={href?.startsWith('http') ? '_blank' : undefined}
                        rel="noreferrer"
                        className="text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary"
                    >
                        {children}
                    </a>
                ),
                ul: ({ children }) => (
                    <ul className="mt-4 list-disc space-y-1 pl-6 text-base leading-7 text-muted marker:text-subtle">
                        {children}
                    </ul>
                ),
                ol: ({ children }) => (
                    <ol className="mt-4 list-decimal space-y-1 pl-6 text-base leading-7 text-muted marker:text-subtle">
                        {children}
                    </ol>
                ),
                blockquote: ({ children }) => (
                    <blockquote className="mt-6 border-l-2 border-warning pl-4 text-muted italic">
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
                    <th className="border-b border-foreground/20 px-3 py-2 text-left font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">
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

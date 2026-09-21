import { locales, type Language } from '$/content';

interface FooterProps {
    language: Language;
}

export function Footer({ language }: FooterProps) {
    const content = locales[language];

    return (
        <footer className="relative z-10 border-t border-foreground/10 bg-surface px-5 py-6 sm:px-8 lg:px-10">
            <div className="mx-auto flex max-w-7xl flex-col gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle sm:flex-row sm:items-center sm:justify-between">
                <span>{content.owner.displayName}</span>
                <span>
                    {content.footer} · {new Date().getFullYear()}
                </span>
            </div>
        </footer>
    );
}

export default Footer;

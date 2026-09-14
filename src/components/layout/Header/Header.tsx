import { locales, type Language } from '$/content';

import LanguageMenu from '$/components/ui/LanguageMenu';

interface HeaderProps {
    language: Language;
    onLanguageChange: (language: Language) => void;
}

export function Header({ language, onLanguageChange }: HeaderProps) {
    const content = locales[language];

    return (
        <header className="relative z-20 border-b border-foreground/10 bg-background/75 backdrop-blur-md">
            <nav
                className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8 sm:py-5 lg:px-10"
                aria-label={content.navigation.primary}
            >
                <div className="flex w-full items-center justify-between sm:w-auto sm:gap-7">
                    <a
                        href="#top"
                        className="font-display text-xl leading-none tracking-[-0.04em] text-foreground sm:text-2xl"
                    >
                        {content.owner.displayName}
                    </a>

                    <div className="sm:border-l sm:border-foreground/10 sm:pl-7">
                        <LanguageMenu
                            language={language}
                            onLanguageChange={onLanguageChange}
                        />
                    </div>
                </div>

                <div className="flex w-full items-center justify-between border-t border-foreground/10 pt-3 sm:w-auto sm:justify-start sm:gap-7 sm:border-0 sm:pt-0">
                    {content.links.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted transition-colors hover:text-primary sm:text-xs"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            </nav>
        </header>
    );
}

export default Header;

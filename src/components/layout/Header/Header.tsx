import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';

import BrandIcon, { isBrandIconName } from '$/components/ui/BrandIcon';
import LanguageMenu from '$/components/ui/LanguageMenu';
import { locales, type Language } from '$/content';

interface HeaderProps {
    language: Language;
    onLanguageChange: (language: Language) => void;
}

/**
 * Scroll threshold (in px) past which the show-on-scroll-up behavior kicks in.
 * Below it (near the top of the page) the header is always visible.
 */
const SCROLL_THRESHOLD = 80;

export function Header({ language, onLanguageChange }: HeaderProps) {
    const content = locales[language];
    const [isHidden, setIsHidden] = useState(false);
    const location = useLocation();
    const isAbout = location.pathname === '/about';

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const scrollY = window.scrollY;

            if (scrollY <= SCROLL_THRESHOLD) {
                setIsHidden(false);
            } else if (scrollY > lastScrollY) {
                // Scrolling down — tuck the header away.
                setIsHidden(true);
            } else if (scrollY < lastScrollY) {
                // Scrolling up — reveal the header.
                setIsHidden(false);
            }

            lastScrollY = scrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`
        fixed inset-x-0 top-0 z-20
        border-b border-foreground/10
        bg-background/75 backdrop-blur-md
        transition-transform duration-300 ease-out
        ${isHidden ? '-translate-y-full' : 'translate-y-0'}
      `}
        >
            <nav
                className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8 sm:py-5 lg:px-10"
                aria-label={content.navigation.primary}
            >
                <div className="flex w-full items-center justify-between sm:w-auto sm:gap-7">
                    <Link
                        to="/"
                        className="font-display text-xl leading-none tracking-[-0.04em] text-foreground sm:text-2xl"
                    >
                        {content.owner.displayName}
                    </Link>

                    <div className="sm:border-l sm:border-foreground/10 sm:pl-7">
                        <LanguageMenu
                            language={language}
                            onLanguageChange={onLanguageChange}
                        />
                    </div>
                </div>

                <div className="flex w-full items-center justify-between border-t border-foreground/10 pt-3 sm:w-auto sm:justify-start sm:gap-7 sm:border-0 sm:pt-0">
                    <Link
                        to="/about"
                        aria-current={isAbout ? 'page' : undefined}
                        className={`text-[11px] font-medium uppercase tracking-[0.14em] transition-colors sm:text-xs ${isAbout ? 'text-primary' : 'text-muted hover:text-primary'}`}
                    >
                        {content.navigation.about}
                    </Link>

                    {content.links.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted transition-colors hover:text-primary sm:text-xs"
                        >
                            {typeof link.icon === 'string' &&
                                isBrandIconName(link.icon) && (
                                    <BrandIcon
                                        name={link.icon}
                                        size={13}
                                        className="opacity-70 transition-opacity group-hover:opacity-100"
                                    />
                                )}
                            {link.label}
                        </a>
                    ))}
                </div>
            </nav>
        </header>
    );
}

export default Header;

import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';

import BrandIcon, { isBrandIconName } from '$/components/ui/BrandIcon';
import LanguageMenu from '$/components/ui/LanguageMenu';
import NavMenu from '$/components/ui/NavMenu';
import SafeLink from '$/components/ui/SafeLink';
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

    // Internal route links — client-side navigation with page transitions.
    // Shown inline on desktop; inside the NavMenu drawer on mobile.
    const routeLinks = [
        { to: '/about', label: content.navigation.about },
        { to: '/projects', label: content.navigation.projects },
        { to: '/notes', label: content.navigation.notes },
        { to: '/contact', label: content.navigation.contact },
    ];

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
                className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-8 sm:py-5 lg:px-10"
                aria-label={content.navigation.primary}
            >
                <div className="flex items-center gap-7">
                    <Link
                        to="/"
                        className="font-display text-xl leading-none tracking-[-0.04em] text-foreground sm:text-2xl"
                    >
                        {content.owner.displayName}
                    </Link>

                    <div className="hidden border-l border-foreground/10 pl-7 sm:block">
                        <LanguageMenu
                            language={language}
                            onLanguageChange={onLanguageChange}
                        />
                    </div>
                </div>

                {/* Desktop: inline page links + icon-only social links. */}
                <div className="hidden items-center gap-7 sm:flex">
                    {routeLinks.map((routeLink) => (
                        <Link
                            key={routeLink.to}
                            to={routeLink.to}
                            aria-current={
                                location.pathname === routeLink.to
                                    ? 'page'
                                    : undefined
                            }
                            className={`text-xs font-medium uppercase tracking-[0.14em] transition-colors ${location.pathname === routeLink.to ? 'text-primary' : 'text-muted hover:text-primary'}`}
                        >
                            {routeLink.label}
                        </Link>
                    ))}

                    <div className="flex items-center gap-4 border-l border-foreground/10 pl-7">
                        {content.links.map((link) => (
                            <SafeLink
                                key={link.label}
                                href={link.href}
                                aria-label={link.label}
                                title={link.label}
                                className="text-muted transition-colors hover:text-primary"
                            >
                                {typeof link.icon === 'string' &&
                                    isBrandIconName(link.icon) && (
                                        <BrandIcon name={link.icon} size={16} />
                                    )}
                            </SafeLink>
                        ))}
                    </div>
                </div>

                {/* Mobile: language menu, then the NavMenu drawer trigger. */}
                <div className="flex items-center gap-5 sm:hidden">
                    <LanguageMenu
                        language={language}
                        onLanguageChange={onLanguageChange}
                    />
                    <div className="border-l border-foreground/10 pl-5">
                        <NavMenu language={language} />
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;

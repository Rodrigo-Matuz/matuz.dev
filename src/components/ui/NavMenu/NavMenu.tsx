import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router';
import { X } from 'lucide-react';

import BrandIcon, { isBrandIconName } from '$/components/ui/BrandIcon';
import SafeLink from '$/components/ui/SafeLink';
import { locales, type Language } from '$/content';

interface NavMenuProps {
    language: Language;
}

/**
 * Mobile navigation drawer — slides in from the right, listing site pages and
 * social links. Owns its own open/close state (same pattern as LanguageMenu);
 * the Header only renders the hamburger trigger.
 */
export function NavMenu({ language }: NavMenuProps) {
    const content = locales[language];
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const location = useLocation();

    const routeLinks = [
        { to: '/', label: content.navigation.home },
        { to: '/about', label: content.navigation.about },
        { to: '/projects', label: content.navigation.projects },
        { to: '/notes', label: content.navigation.notes },
        { to: '/contact', label: content.navigation.contact },
    ];

    useEffect(() => {
        if (!isOpen) return;

        const onPointerDown = (event: PointerEvent) => {
            const target = event.target as Node;

            // The drawer is portaled to document.body, so it lives outside
            // containerRef — treat clicks inside it as "inside" as well.
            const isInsideMenu =
                (containerRef.current &&
                    containerRef.current.contains(target)) ||
                (target instanceof Element &&
                    target.closest('#nav-menu') !== null);

            if (!isInsideMenu) {
                setIsOpen(false);
            }
        };

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
                triggerRef.current?.focus();
            }
        };

        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [isOpen]);

    return (
        <div ref={containerRef} className="relative">
            <button
                ref={triggerRef}
                type="button"
                aria-expanded={isOpen}
                aria-haspopup="menu"
                aria-controls="nav-menu"
                aria-label={content.navigation.menu}
                onClick={() => setIsOpen((open) => !open)}
                className="flex items-center gap-1.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-muted transition-colors hover:text-primary sm:text-xs"
            >
                <span
                    aria-hidden="true"
                    className="flex w-4 flex-col gap-[3px]"
                >
                    <span
                        className={`h-px w-full bg-current transition-transform duration-200 ${isOpen ? 'translate-y-[4px] rotate-45' : ''}`}
                    />
                    <span
                        className={`h-px w-full bg-current transition-opacity duration-200 ${isOpen ? 'opacity-0' : ''}`}
                    />
                    <span
                        className={`h-px w-full bg-current transition-transform duration-200 ${isOpen ? '-translate-y-[4px] -rotate-45' : ''}`}
                    />
                </span>
                <span className="hidden sm:inline">
                    {content.navigation.menu}
                </span>
            </button>

            {isOpen &&
                createPortal(
                    <div
                        id="nav-menu"
                        role="menu"
                        aria-label={content.navigation.primary}
                        className="fixed inset-y-0 right-0 z-30 w-64 origin-top-right animate-[menu-in_160ms_ease-out] overflow-y-auto border-l border-foreground/10 bg-background pt-20 shadow-[-24px_0_60px_-24px_rgba(0,0,0,0.8)] backdrop-blur-md"
                    >
                        <div className="flex items-center justify-between border-b border-foreground/10 px-4 py-3">
                            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-subtle">
                                {content.navigation.primary}
                            </span>
                            <button
                                type="button"
                                aria-label={content.navigation.closeMenu}
                                onClick={() => {
                                    setIsOpen(false);
                                    triggerRef.current?.focus();
                                }}
                                className="text-subtle transition-colors hover:text-foreground"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="px-4 py-3">
                            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-subtle">
                                {content.navigation.pages}
                            </p>
                            <ul className="mt-2">
                                {routeLinks.map((routeLink) => (
                                    <li key={routeLink.to}>
                                        <Link
                                            to={routeLink.to}
                                            role="menuitem"
                                            aria-current={
                                                location.pathname ===
                                                routeLink.to
                                                    ? 'page'
                                                    : undefined
                                            }
                                            onClick={() => setIsOpen(false)}
                                            className={`block py-2 font-display text-lg tracking-[-0.02em] transition-colors ${location.pathname === routeLink.to ? 'text-primary' : 'text-foreground hover:text-primary'}`}
                                        >
                                            {routeLink.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="border-t border-foreground/10 px-4 py-3">
                            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-subtle">
                                {content.navigation.social}
                            </p>
                            <ul className="mt-2">
                                {content.links.map((link) => (
                                    <li key={link.label}>
                                        <SafeLink
                                            href={link.href}
                                            role="menuitem"
                                            target={
                                                link.href.startsWith('http')
                                                    ? '_blank'
                                                    : undefined
                                            }
                                            rel="noreferrer"
                                            onClick={() => setIsOpen(false)}
                                            className="group flex items-center gap-3 py-2 text-sm text-muted transition-colors hover:text-foreground"
                                        >
                                            {typeof link.icon === 'string' &&
                                                isBrandIconName(link.icon) && (
                                                    <BrandIcon
                                                        name={link.icon}
                                                        size={14}
                                                        className="shrink-0 opacity-70 transition-opacity group-hover:opacity-100"
                                                    />
                                                )}
                                            {link.label}
                                        </SafeLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>,
                    document.body,
                )}
        </div>
    );
}

export default NavMenu;

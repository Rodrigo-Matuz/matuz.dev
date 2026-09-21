import { useEffect, useRef, useState } from "react";

import { Check, ChevronDown } from "lucide-react";

// Import only the flags we use — importing the full flag-icons CSS would bundle
// every country's SVG into the build. Vite gives us asset URLs for these.
import brFlag from "flag-icons/flags/4x3/br.svg";
import usFlag from "flag-icons/flags/4x3/us.svg";

import { locales, type Language } from "$/content";

const languageOptions: Language[] = ["en", "pt-BR"];

const flagSources: Record<string, string> = {
    br: brFlag,
    us: usFlag,
};

interface LanguageMenuProps {
    language: Language;
    onLanguageChange: (language: Language) => void;
}

function Flag({ code }: { code: string }) {
    return (
        <img
            aria-hidden="true"
            src={flagSources[code]}
            alt=""
            loading="lazy"
            className="block h-3.5 w-5 shrink-0 rounded-[2px] object-cover shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"
        />
    );
}

export function LanguageMenu({
    language,
    onLanguageChange,
}: LanguageMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const content = locales[language];

    useEffect(() => {
        if (!isOpen) return;

        const onPointerDown = (event: PointerEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
                triggerRef.current?.focus();
            }
        };

        document.addEventListener("pointerdown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("pointerdown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [isOpen]);

    return (
        <div ref={containerRef} className="relative">
            <button
                ref={triggerRef}
                type="button"
                aria-expanded={isOpen}
                aria-haspopup="menu"
                aria-controls="language-menu"
                aria-label={content.navigation.languageSelector}
                onClick={() => setIsOpen((open) => !open)}
                className={`inline-flex items-center gap-1.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors sm:text-[11px] ${isOpen ? "text-foreground" : "text-muted hover:text-primary"}`}
            >
                <Flag code={content.countryCode} />
                {/* nowrap: "PT-BR" must never wrap mid-label (it would break
                    across two lines in the narrow mobile header). */}
                <span className="whitespace-nowrap">{content.shortLabel}</span>
                <ChevronDown
                    size={12}
                    className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {isOpen && (
                <div
                    id="language-menu"
                    role="menu"
                    aria-label={content.navigation.languageSelector}
                    className="absolute right-0 top-[calc(100%+0.75rem)] z-30 w-56 origin-top-right animate-[menu-in_160ms_ease-out] border border-foreground/10 bg-background/90 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8)] backdrop-blur-md"
                >
                    {languageOptions.map((option, index) => {
                        const optionContent = locales[option];
                        const isSelected = language === option;

                        return (
                            <button
                                key={option}
                                type="button"
                                role="menuitemradio"
                                aria-checked={isSelected}
                                lang={option}
                                onClick={() => {
                                    onLanguageChange(option);
                                    setIsOpen(false);
                                    triggerRef.current?.focus();
                                }}
                                className={`group flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${index > 0 ? "border-t border-foreground/10" : ""} ${isSelected ? "text-foreground" : "text-muted hover:bg-foreground/5 hover:text-foreground"}`}
                            >
                                <Flag code={optionContent.countryCode} />
                                <span className="flex-1 font-display text-base leading-none tracking-[-0.02em]">
                                    {optionContent.languageName}
                                </span>
                                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-subtle">
                                    {optionContent.shortLabel}
                                </span>
                                {isSelected ? (
                                    <Check
                                        size={13}
                                        className="text-primary"
                                        aria-hidden="true"
                                    />
                                ) : (
                                    <span
                                        className="size-[13px]"
                                        aria-hidden="true"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default LanguageMenu;

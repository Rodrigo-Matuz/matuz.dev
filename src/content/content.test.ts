import { describe, expect, it } from 'vitest';

import { locales, type Language } from './index';
import eng from './eng.json';
import ptBr from './pt-br.json';

const languageKeys = Object.keys(locales) as Language[];

/**
 * Recursively collects the "shape" of an object: keys of objects and the
 * lengths/types of arrays and primitives, so locale dictionaries can be
 * compared structurally regardless of their translated text.
 */
function shapeOf(value: unknown): string | Record<string, unknown> {
    if (Array.isArray(value)) {
        return `array(${value.length}):[${value.map(shapeOf).join('|')}]`;
    }
    if (value !== null && typeof value === 'object') {
        const entries = Object.entries(value as Record<string, unknown>).map(
            ([key, child]) => [key, shapeOf(child)] as const,
        );
        return Object.fromEntries(entries);
    }
    return typeof value;
}

describe('content locales', () => {
    it('exposes exactly the en and pt-BR locales', () => {
        expect(languageKeys.sort()).toEqual(['en', 'pt-BR']);
    });

    it('has identical structure across all locales', () => {
        const reference = shapeOf(locales.en);

        for (const key of languageKeys) {
            expect(shapeOf(locales[key]), `locale "${key}"`).toEqual(reference);
        }
    });

    it('has non-empty strings in both locales', () => {
        for (const key of languageKeys) {
            const locale = locales[key] as unknown as Record<string, unknown>;

            expect(locale.languageName, key).toBeTruthy();
            expect(locale.shortLabel, key).toBeTruthy();
            expect(locale.countryCode, key).toMatch(/^[a-z]{2}$/);
        }
    });

    it('maps locales to distinct country codes', () => {
        const codes = languageKeys.map((key) => locales[key].countryCode);

        expect(new Set(codes).size).toBe(languageKeys.length);
    });

    it('provides navigation labels in both locales', () => {
        for (const key of languageKeys) {
            expect(locales[key].navigation.primary).toBeTruthy();
            expect(locales[key].navigation.languageSelector).toBeTruthy();
        }
    });

    it('provides owner identity in both locales', () => {
        for (const key of languageKeys) {
            expect(locales[key].owner.displayName).toBeTruthy();
            expect(locales[key].owner.location).toBeTruthy();
        }
    });

    it('renders the same owner name in every locale', () => {
        // The person's name is a proper noun; it must not be "translated".
        const names = languageKeys.map((key) => locales[key].owner.displayName);

        expect(new Set(names).size).toBe(1);
    });

    describe('links', () => {
        it('has the same link labels in the same order in every locale', () => {
            const reference = locales.en.links.map((link) => link.label);

            for (const key of languageKeys) {
                expect(locales[key].links.map((link) => link.label)).toEqual(
                    reference,
                );
            }
        });

        it('has valid hrefs for every link', () => {
            for (const key of languageKeys) {
                for (const link of locales[key].links) {
                    expect(link.href, `${key}:${link.label}`).toMatch(
                        /^(https?:\/\/|#)/,
                    );
                }
            }
        });

        it('includes GitHub and LinkedIn links', () => {
            for (const key of languageKeys) {
                const labels = locales[key].links.map((link) => link.label);

                expect(labels).toContain('GitHub');
                expect(labels).toContain('LinkedIn');
            }
        });

        it('points GitHub at the expected profile', () => {
            for (const key of languageKeys) {
                const github = locales[key].links.find(
                    (link) => link.label === 'GitHub',
                );

                expect(github?.href).toContain('github.com/rodrigo-matuz');
            }
        });
    });

    describe('hero', () => {
        it('provides kicker, title, introduction, record link and closing line', () => {
            for (const key of languageKeys) {
                expect(locales[key].hero.kicker, key).toBeTruthy();
                expect(locales[key].hero.title, key).toBeTruthy();
                expect(locales[key].hero.introduction, key).toBeTruthy();
                expect(locales[key].hero.recordLink, key).toBeTruthy();
                expect(locales[key].hero.closingLine, key).toBeTruthy();
            }
        });
    });

    describe('record', () => {
        it('provides four entries with label, title and description', () => {
            for (const key of languageKeys) {
                expect(locales[key].record.entries).toHaveLength(4);

                for (const entry of locales[key].record.entries) {
                    expect(entry.label, key).toBeTruthy();
                    expect(entry.title, key).toBeTruthy();
                    expect(entry.description, key).toBeTruthy();
                }
            }
        });

        it('has unique entry labels per locale', () => {
            for (const key of languageKeys) {
                const labels = locales[key].record.entries.map(
                    (entry) => entry.label,
                );

                expect(new Set(labels).size).toBe(labels.length);
            }
        });
    });

    describe('experience', () => {
        it('provides at least five highlights in both locales', () => {
            for (const key of languageKeys) {
                expect(
                    locales[key].experience.highlights.length,
                    key,
                ).toBeGreaterThanOrEqual(5);

                for (const highlight of locales[key].experience.highlights) {
                    expect(highlight, key).toBeTruthy();
                }
            }
        });

        it('mentions the AWS certification in both locales', () => {
            for (const key of languageKeys) {
                const highlights = locales[key].experience.highlights.join(' ');

                expect(highlights).toContain('AWS');
            }
        });
    });

    describe('correspondence', () => {
        it('uses the real contact email in both locales', () => {
            for (const key of languageKeys) {
                expect(locales[key].correspondence.email).toBe(
                    'mail@matuz.me',
                );
                expect(locales[key].correspondence.emailHref).toBe(
                    'mailto:mail@matuz.me',
                );
            }
        });

        it('provides both action labels', () => {
            for (const key of languageKeys) {
                expect(locales[key].correspondence.primaryAction).toBeTruthy();
                expect(locales[key].correspondence.secondaryAction).toBeTruthy();
            }
        });
    });

    describe('locale dictionaries', () => {
        it('eng.json holds the English dictionary', () => {
            expect(locales.en).toBe(eng);
        });

        it('pt-br.json holds the Brazilian Portuguese dictionary', () => {
            expect(locales['pt-BR']).toBe(ptBr);
        });
    });
});

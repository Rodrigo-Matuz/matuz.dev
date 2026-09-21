import { describe, expect, it } from "vitest";

import { locales, type Language } from "./index";
import enCommon from "../i18n/en/common.json";
import ptCommon from "../i18n/pt-BR/common.json";

const languageKeys = Object.keys(locales) as Language[];

/**
 * Recursively collects the "shape" of an object: keys of objects and the
 * lengths/types of arrays and primitives, so locale dictionaries can be
 * compared structurally regardless of their translated text.
 */
function shapeOf(value: unknown): string | Record<string, unknown> {
    if (Array.isArray(value)) {
        return `array(${value.length}):[${value.map(shapeOf).join("|")}]`;
    }
    if (value !== null && typeof value === "object") {
        const entries = Object.entries(value as Record<string, unknown>).map(
            ([key, child]) => [key, shapeOf(child)] as const,
        );
        return Object.fromEntries(entries);
    }
    return typeof value;
}

describe("content locales", () => {
    it("exposes exactly the en and pt-BR locales", () => {
        expect(languageKeys.sort()).toEqual(["en", "pt-BR"]);
    });

    it("has identical structure across all locales", () => {
        const reference = shapeOf(locales.en);

        for (const key of languageKeys) {
            expect(shapeOf(locales[key]), `locale "${key}"`).toEqual(reference);
        }
    });

    it("has non-empty strings in both locales", () => {
        for (const key of languageKeys) {
            const locale = locales[key] as unknown as Record<string, unknown>;

            expect(locale.languageName, key).toBeTruthy();
            expect(locale.shortLabel, key).toBeTruthy();
            expect(locale.countryCode, key).toMatch(/^[a-z]{2}$/);
        }
    });

    it("maps locales to distinct country codes", () => {
        const codes = languageKeys.map((key) => locales[key].countryCode);

        expect(new Set(codes).size).toBe(languageKeys.length);
    });

    it("provides navigation labels in both locales", () => {
        for (const key of languageKeys) {
            expect(locales[key].navigation.primary).toBeTruthy();
            expect(locales[key].navigation.languageSelector).toBeTruthy();
        }
    });

    it("provides owner identity in both locales", () => {
        for (const key of languageKeys) {
            expect(locales[key].owner.displayName).toBeTruthy();
            expect(locales[key].owner.location).toBeTruthy();
        }
    });

    it("renders the same owner name in every locale", () => {
        // The person's name is a proper noun; it must not be "translated".
        const names = languageKeys.map((key) => locales[key].owner.displayName);

        expect(new Set(names).size).toBe(1);
    });

    describe("links", () => {
        it("has the same link icons in the same order in every locale", () => {
            // Labels are localized (e.g. "Notes" / "Notas"); icons are the
            // locale-neutral identity of each link.
            const reference = locales.en.links.map((link) => link.icon);

            for (const key of languageKeys) {
                expect(locales[key].links.map((link) => link.icon)).toEqual(
                    reference,
                );
            }
        });

        it("has valid hrefs for every link", () => {
            for (const key of languageKeys) {
                for (const link of locales[key].links) {
                    expect(link.href, `${key}:${link.label}`).toMatch(
                        /^(https?:\/\/|#|\/)/,
                    );
                }
            }
        });

        it("includes GitHub and LinkedIn links", () => {
            for (const key of languageKeys) {
                const labels = locales[key].links.map((link) => link.label);

                expect(labels).toContain("GitHub");
                expect(labels).toContain("LinkedIn");
            }
        });

        it("includes the Discord profile link", () => {
            for (const key of languageKeys) {
                const discord = locales[key].links.find(
                    (link) => link.label === "Discord",
                );

                expect(discord?.href).toBe(
                    "https://discord.com/users/584503954969198612",
                );
            }
        });

        it("points GitHub at the expected profile", () => {
            for (const key of languageKeys) {
                const github = locales[key].links.find(
                    (link) => link.label === "GitHub",
                );

                expect(github?.href).toContain("github.com/rodrigo-matuz");
            }
        });
    });

    describe("projects", () => {
        it("provides heading copy and link labels in both locales", () => {
            for (const key of languageKeys) {
                const projects = locales[key].projects;

                expect(projects.eyebrow, key).toBeTruthy();
                expect(projects.title, key).toBeTruthy();
                expect(projects.description, key).toBeTruthy();
                expect(projects.sourceLabel, key).toBeTruthy();
                expect(projects.previewLabel, key).toBeTruthy();
            }
        });

        it("provides at least three cards with required fields", () => {
            for (const key of languageKeys) {
                const { cards } = locales[key].projects;

                expect(cards.length, key).toBeGreaterThanOrEqual(3);

                for (const card of cards) {
                    expect(card.title, key).toBeTruthy();
                    expect(card.description, key).toBeTruthy();
                    expect(
                        card.technologies.length,
                        `${key}:${card.title}`,
                    ).toBeGreaterThan(0);
                    expect(card.github, `${key}:${card.title}`).toMatch(
                        /^https:\/\/(www\.)?github\.com\//,
                    );
                }
            }
        });

        it("uses the same card ids in the same order in every locale", () => {
            // Titles may be translated (product names stay, but the pt-BR
            // Discord bot title is localized); ids are the stable key.
            const reference = locales.en.projects.cards.map((card) => card.id);

            for (const key of languageKeys) {
                expect(
                    locales[key].projects.cards.map((card) => card.id),
                ).toEqual(reference);
            }
        });

        it("has unique card ids per locale", () => {
            for (const key of languageKeys) {
                const ids = locales[key].projects.cards.map((card) => card.id);

                expect(new Set(ids).size).toBe(ids.length);
            }
        });

        it("only gives preview links to cards that declare one", () => {
            for (const key of languageKeys) {
                for (const card of locales[key].projects.cards) {
                    if (card.preview !== undefined) {
                        expect(card.preview, `${key}:${card.title}`).toMatch(
                            /^(https?:\/\/|\/)/,
                        );
                    }
                }
            }
        });
    });

    describe("hero", () => {
        it("provides kicker, title, introduction, record link and closing line", () => {
            for (const key of languageKeys) {
                expect(locales[key].hero.kicker, key).toBeTruthy();
                expect(locales[key].hero.title, key).toBeTruthy();
                expect(locales[key].hero.introduction, key).toBeTruthy();
                expect(locales[key].hero.recordLink, key).toBeTruthy();
                expect(locales[key].hero.closingLine, key).toBeTruthy();
            }
        });
    });

    describe("record", () => {
        it("provides four entries with label, title and description", () => {
            for (const key of languageKeys) {
                expect(locales[key].record.entries).toHaveLength(4);

                for (const entry of locales[key].record.entries) {
                    expect(entry.label, key).toBeTruthy();
                    expect(entry.title, key).toBeTruthy();
                    expect(entry.description, key).toBeTruthy();
                }
            }
        });

        it("has unique entry labels per locale", () => {
            for (const key of languageKeys) {
                const labels = locales[key].record.entries.map(
                    (entry) => entry.label,
                );

                expect(new Set(labels).size).toBe(labels.length);
            }
        });
    });

    describe("experience", () => {
        it("provides at least five highlights in both locales", () => {
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

        it("mentions the AWS certification in both locales", () => {
            for (const key of languageKeys) {
                const highlights = locales[key].experience.highlights.join(" ");

                expect(highlights).toContain("AWS");
            }
        });
    });

    describe("correspondence", () => {
        it("uses the real contact email in both locales", () => {
            for (const key of languageKeys) {
                expect(locales[key].correspondence.email).toBe("mail@matuz.me");
                expect(locales[key].correspondence.emailHref).toBe(
                    "mailto:mail@matuz.me",
                );
            }
        });

        it("provides both action labels", () => {
            for (const key of languageKeys) {
                expect(locales[key].correspondence.primaryAction).toBeTruthy();
                expect(
                    locales[key].correspondence.secondaryAction,
                ).toBeTruthy();
            }
        });
    });

    describe("contact", () => {
        it("provides page copy and notes in both locales", () => {
            for (const key of languageKeys) {
                const contact = locales[key].contact;

                expect(contact.eyebrow, key).toBeTruthy();
                expect(contact.title, key).toBeTruthy();
                expect(contact.description, key).toBeTruthy();
                expect(contact.emailNote, key).toBeTruthy();
                expect(contact.discordNote, key).toBeTruthy();
                expect(contact.closing, key).toBeTruthy();
            }
        });

        it("provides channels with valid hrefs in both locales", () => {
            for (const key of languageKeys) {
                for (const channel of locales[key].contact.channels) {
                    expect(channel.label, `${key}:${channel.id}`).toBeTruthy();
                    expect(channel.value, `${key}:${channel.id}`).toBeTruthy();
                    expect(channel.note, `${key}:${channel.id}`).toBeTruthy();
                    expect(channel.href, `${key}:${channel.id}`).toMatch(
                        /^(https?:\/\/|mailto:)/,
                    );
                }
            }
        });

        it("uses the same channel ids in the same order in every locale", () => {
            const reference = locales.en.contact.channels.map(
                (channel) => channel.id,
            );

            for (const key of languageKeys) {
                expect(
                    locales[key].contact.channels.map((channel) => channel.id),
                ).toEqual(reference);
            }
        });

        it("lists email, GitHub, LinkedIn and Discord channels", () => {
            for (const key of languageKeys) {
                const ids = locales[key].contact.channels.map(
                    (channel) => channel.id,
                );

                expect(ids).toEqual(
                    expect.arrayContaining([
                        "email",
                        "github",
                        "linkedin",
                        "discord",
                    ]),
                );
            }
        });

        it("points the email channel at the real address", () => {
            for (const key of languageKeys) {
                const email = locales[key].contact.channels.find(
                    (channel) => channel.id === "email",
                );

                expect(email?.href).toBe("mailto:mail@matuz.me");
            }
        });

        it("points the Discord channel at the profile", () => {
            for (const key of languageKeys) {
                const discord = locales[key].contact.channels.find(
                    (channel) => channel.id === "discord",
                );

                expect(discord?.value).toBe("@matuz");
                expect(discord?.href).toBe(
                    "https://discord.com/users/584503954969198612",
                );
            }
        });
    });

    describe("about", () => {
        it("provides a beyond-work section in both locales", () => {
            for (const key of languageKeys) {
                const beyondWork = locales[key].about.whoAmI.beyondWork;

                expect(beyondWork.eyebrow, key).toBeTruthy();
                expect(beyondWork.title, key).toBeTruthy();
                expect(
                    beyondWork.paragraphs.length,
                    key,
                ).toBeGreaterThanOrEqual(2);

                for (const paragraph of beyondWork.paragraphs) {
                    expect(paragraph, key).toBeTruthy();
                }
            }
        });

        it("mentions NixOS in the beyond-work section", () => {
            for (const key of languageKeys) {
                const text =
                    locales[key].about.whoAmI.beyondWork.paragraphs.join(" ");

                expect(text).toContain("NixOS");
            }
        });
    });

    describe("locale dictionaries", () => {
        it("en/common.json holds the English common section", () => {
            expect(locales.en.navigation).toEqual(enCommon.navigation);
        });

        it("pt-BR/common.json holds the Brazilian Portuguese common section", () => {
            expect(locales["pt-BR"].navigation).toEqual(ptCommon.navigation);
        });
    });
});

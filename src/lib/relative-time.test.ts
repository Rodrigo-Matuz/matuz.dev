import { describe, expect, it } from "vitest";

import { formatRelativeTime, parseTimestamp } from "./relative-time";

const NOW = new Date("2026-09-19T12:00:00");

describe("parseTimestamp", () => {
    it("parses a valid timestamp", () => {
        expect(parseTimestamp("2026-09-19T07:54")).toEqual(
            new Date("2026-09-19T07:54"),
        );
    });

    it("returns null for null or invalid values", () => {
        expect(parseTimestamp(null)).toBeNull();
        expect(parseTimestamp("oops")).toBeNull();
    });
});

describe("formatRelativeTime", () => {
    it("formats minutes", () => {
        const date = new Date("2026-09-19T11:45:00");

        expect(formatRelativeTime(date, "en", NOW)).toBe("15 minutes ago");
    });

    it("formats hours", () => {
        const date = new Date("2026-09-19T09:00:00");

        expect(formatRelativeTime(date, "en", NOW)).toBe("3 hours ago");
    });

    it("formats days", () => {
        const date = new Date("2026-09-17T12:00:00");

        expect(formatRelativeTime(date, "en", NOW)).toBe("2 days ago");
    });

    it("formats weeks", () => {
        const date = new Date("2026-09-05T12:00:00");

        expect(formatRelativeTime(date, "en", NOW)).toBe("2 weeks ago");
    });

    it("formats months", () => {
        const date = new Date("2026-07-01T12:00:00");

        expect(formatRelativeTime(date, "en", NOW)).toContain("month");
    });

    it("formats years", () => {
        const date = new Date("2024-01-01T12:00:00");

        expect(formatRelativeTime(date, "en", NOW)).toContain("year");
    });

    it("localizes to pt-BR", () => {
        const date = new Date("2026-09-17T12:00:00");

        expect(formatRelativeTime(date, "pt-BR", NOW)).toBe("há 2 dias");
    });
});

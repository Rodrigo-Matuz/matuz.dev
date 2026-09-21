import { describe, expect, it } from "vitest";

import {
    deriveTitle,
    parseNoteHeader,
    sortNotes,
    stripNoteHeader,
    type NoteMeta,
} from "./notes-meta";

const HEADER = "```\ncreated: 2026-09-19T07:54\nupdated: 2026-09-19T07:55\n```";

describe("parseNoteHeader", () => {
    it("parses the fenced header block", () => {
        const raw = `${HEADER}\n# Title\n\nbody`;

        expect(parseNoteHeader(raw)).toEqual({
            created: "2026-09-19T07:54",
            updated: "2026-09-19T07:55",
        });
    });

    it("parses unfenced header lines as a fallback", () => {
        const raw =
            "created: 2026-09-19T07:54\nupdated: 2026-09-19T07:55\n\n# T";

        expect(parseNoteHeader(raw)).toEqual({
            created: "2026-09-19T07:54",
            updated: "2026-09-19T07:55",
        });
    });

    it("parses a YAML frontmatter block with extra fields", () => {
        const raw = [
            "---",
            "created: 2026-09-19T07:54",
            "updated: 2026-09-19T09:26",
            "title: Markdown Test Page",
            "tags:",
            "  - test",
            "---",
            "",
            "# Heading",
        ].join("\n");

        expect(parseNoteHeader(raw)).toEqual({
            created: "2026-09-19T07:54",
            updated: "2026-09-19T09:26",
        });
    });

    it("finds created/updated anywhere in the frontmatter block", () => {
        const raw = [
            "---",
            "title: Hello, World!",
            "date: 2025-04-05",
            "tags:",
            "  - blog",
            "  - hello-world",
            "created: 2026-09-19T10:12",
            "updated: 2026-09-19T10:12",
            "---",
            "",
            "# body",
        ].join("\n");

        expect(parseNoteHeader(raw)).toEqual({
            created: "2026-09-19T10:12",
            updated: "2026-09-19T10:12",
        });
    });

    it("returns nulls for a note without a header", () => {
        expect(parseNoteHeader("# Just content")).toEqual({
            created: null,
            updated: null,
        });
    });

    it("returns nulls for a malformed header", () => {
        expect(parseNoteHeader("```\ncreated: oops\n```")).toEqual({
            created: null,
            updated: null,
        });
    });
});

describe("stripNoteHeader", () => {
    it("removes the fenced header block", () => {
        expect(stripNoteHeader(`${HEADER}\n# Title`)).toBe("# Title");
    });

    it("removes loose header lines", () => {
        const raw =
            "created: 2026-09-19T07:54\nupdated: 2026-09-19T07:55\n\nbody";

        expect(stripNoteHeader(raw)).toBe("body");
    });

    it("removes a YAML frontmatter block including extra fields", () => {
        const raw = [
            "---",
            "created: 2026-09-19T07:54",
            "updated: 2026-09-19T09:26",
            "title: Markdown Test Page",
            "tags:",
            "  - test",
            "---",
            "",
            "# Heading",
        ].join("\n");

        expect(stripNoteHeader(raw)).toBe("# Heading");
    });

    it("leaves content without a header untouched", () => {
        expect(stripNoteHeader("# Title\n\nbody")).toBe("# Title\n\nbody");
    });
});

describe("deriveTitle", () => {
    it("uses the first h1 heading", () => {
        expect(deriveTitle("# My Note\nbody", "file.md")).toBe("My Note");
    });

    it("prefers the frontmatter title over the first heading", () => {
        const raw = [
            "---",
            "created: 2026-09-19T07:54",
            "title: Markdown Test Page",
            "---",
            "# Heading",
        ].join("\n");

        expect(deriveTitle(raw, "file.md")).toBe("Markdown Test Page");
    });

    it("strips quotes from a quoted frontmatter title", () => {
        const raw = '---\ntitle: "Quoted Title"\n---\nbody';

        expect(deriveTitle(raw, "file.md")).toBe("Quoted Title");
    });

    it("falls back to the filename without dashes", () => {
        expect(deriveTitle("body only", "my-note.md")).toBe("my note");
    });
});

describe("sortNotes", () => {
    const note = (slug: string, created: string | null): NoteMeta => ({
        slug,
        id: slug,
        title: slug,
        created,
        updated: created,
    });

    it("sorts newest first", () => {
        const sorted = sortNotes([
            note("old", "2026-01-01T00:00"),
            note("new", "2026-09-19T07:54"),
            note("mid", "2026-05-05T12:00"),
        ]);

        expect(sorted.map((n) => n.slug)).toEqual(["new", "mid", "old"]);
    });

    it("puts notes without created last", () => {
        const sorted = sortNotes([
            note("unknown", null),
            note("dated", "2026-01-01T00:00"),
        ]);

        expect(sorted.map((n) => n.slug)).toEqual(["dated", "unknown"]);
    });

    it("breaks ties by slug alphabetically", () => {
        const sorted = sortNotes([
            note("b", "2026-01-01T00:00"),
            note("a", "2026-01-01T00:00"),
        ]);

        expect(sorted.map((n) => n.slug)).toEqual(["a", "b"]);
    });

    it("does not mutate the input array", () => {
        const input = [
            note("a", "2026-01-01T00:00"),
            note("b", "2026-02-01T00:00"),
        ];

        sortNotes(input);

        expect(input.map((n) => n.slug)).toEqual(["a", "b"]);
    });
});

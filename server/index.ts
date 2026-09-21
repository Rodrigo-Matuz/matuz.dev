/**
 * Production server: serves the built SPA from dist/ and exposes the notes
 * API under /api/notes. The GitHub PAT lives only here, in environment
 * variables — it never reaches the browser bundle.
 *
 * Configuration (environment):
 *   NOTES_GITHUB_TOKEN — fine-grained PAT (Contents: Read, vault repo only)
 *   NOTES_REPO         — "owner/repo" of the vault
 *   NOTES_PATH         — tracked folder inside the vault (default: blog)
 *   PORT               — Heroku provides this
 */

import path from "node:path";
import { fileURLToPath } from "node:url";

import express from "express";

import { getNoteContent, getNotesIndex, isNotesConfigured } from "./notes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist");

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.disable("x-powered-by");

// Long cache for hashed build assets; no cache for HTML/API responses.
app.use(
    express.static(distDir, {
        index: false,
        setHeaders(res, filePath) {
            if (filePath.includes(`${path.sep}assets${path.sep}`)) {
                res.setHeader(
                    "Cache-Control",
                    "public, max-age=31536000, immutable",
                );
            }
        },
    }),
);

app.get("/api/notes", async (_req, res) => {
    if (!isNotesConfigured()) {
        res.status(503).json({ error: "Notes source is not configured." });
        return;
    }

    try {
        const notes = await getNotesIndex();

        res.set("Cache-Control", "public, max-age=300");
        res.json({ notes });
    } catch {
        res.status(502).json({ error: "Failed to load notes." });
    }
});

// Nested slugs contain slashes (e.g. user1/FileNameTitle), so use a
// wildcard parameter — :slug alone would not match across '/'.
// Express 5 (path-to-regexp v8) requires wildcard params to be named.
app.get("/api/notes/*splat", async (req, res) => {
    // Express 5 returns wildcard params as string | string[].
    const params = req.params as unknown as { splat?: string | string[] };
    const raw = params.splat;
    const slug = (Array.isArray(raw) ? raw.join("/") : (raw ?? "")).trim();

    if (!slug) {
        res.status(404).json({ error: "Note not found." });
        return;
    }

    if (!isNotesConfigured()) {
        res.status(503).json({ error: "Notes source is not configured." });
        return;
    }

    try {
        const note = await getNoteContent(slug);

        if (!note) {
            res.status(404).json({ error: "Note not found." });
            return;
        }

        res.set("Cache-Control", "public, max-age=300");
        res.json(note);
    } catch {
        res.status(502).json({ error: "Failed to load the note." });
    }
});

// SPA fallback for client-side routes.
app.use((_req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
});

app.listen(port, () => {
    console.log(`matuz.dev server listening on port ${port}`);
});

import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";

import { setLanguage } from "$/lib/language";

// The language store initializes from the browser's locale (jsdom reports
// en-US), so pin it to pt-BR before every test — the suite asserts against
// the pt-BR dictionary as the default.
beforeEach(() => {
    try {
        localStorage.removeItem("matuz.dev:language");
    } catch {
        // ignore
    }
    setLanguage("pt-BR");
    document.documentElement.lang = "pt-BR";
});

afterEach(() => {
    cleanup();

    // Reset again so nothing leaks between test files.
    try {
        localStorage.removeItem("matuz.dev:language");
    } catch {
        // ignore
    }
    setLanguage("pt-BR");
    document.documentElement.lang = "pt-BR";
});

import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import SafeLink from "./SafeLink";

describe("SafeLink", () => {
    it("does not expose the href in the initial HTML", () => {
        render(<SafeLink href="mailto:mail@matuz.me">Email me</SafeLink>);

        const link = screen.getByText("Email me");

        expect(link).not.toHaveAttribute("href");
    });

    it("reveals the href after hover", async () => {
        const user = userEvent.setup();

        render(<SafeLink href="mailto:mail@matuz.me">Email me</SafeLink>);

        const link = screen.getByText("Email me");

        await user.hover(link);

        expect(link).toHaveAttribute("href", "mailto:mail@matuz.me");
    });

    it("reveals the href on focus (keyboard users)", async () => {
        const user = userEvent.setup();

        render(<SafeLink href="https://example.com">Profile</SafeLink>);

        await user.tab();

        expect(screen.getByText("Profile")).toHaveAttribute(
            "href",
            "https://example.com",
        );
    });

    it("reveals the href on touch", async () => {
        render(<SafeLink href="https://example.com">Profile</SafeLink>);

        const link = screen.getByText("Profile");

        act(() => {
            link.dispatchEvent(
                new Event("touchstart", { bubbles: true, cancelable: true }),
            );
        });

        expect(link).toHaveAttribute("href", "https://example.com");
    });

    it("follows the destination on Enter before the href is revealed", async () => {
        const user = userEvent.setup();
        const clickSpy = vi.fn();

        render(<SafeLink href="mailto:mail@matuz.me">Email me</SafeLink>);

        const link = screen.getByText("Email me");

        link.addEventListener("click", clickSpy);

        await user.tab();
        await user.keyboard("{Enter}");

        expect(link).toHaveAttribute("href", "mailto:mail@matuz.me");
        expect(clickSpy).toHaveBeenCalled();
    });

    it("keeps the link role and focusability before reveal", () => {
        render(<SafeLink href="mailto:mail@matuz.me">Email me</SafeLink>);

        const link = screen.getByText("Email me");

        expect(link).toHaveAttribute("role", "link");
        expect(link).toHaveAttribute("tabindex", "0");
    });

    it("drops the explicit role once revealed (native anchor semantics)", async () => {
        const user = userEvent.setup();

        render(<SafeLink href="mailto:mail@matuz.me">Email me</SafeLink>);

        const link = screen.getByText("Email me");

        await user.hover(link);

        expect(link).not.toHaveAttribute("role");
        expect(link).not.toHaveAttribute("tabindex");
    });

    it("passes through extra anchor props like target and rel", () => {
        render(
            <SafeLink
                href="https://example.com"
                target="_blank"
                rel="noreferrer"
            >
                Profile
            </SafeLink>,
        );

        const link = screen.getByText("Profile");

        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noreferrer");
    });
});

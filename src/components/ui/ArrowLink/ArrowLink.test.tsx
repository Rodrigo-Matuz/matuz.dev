import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ArrowLink from "./ArrowLink";

describe("ArrowLink", () => {
    it("renders as an anchor with the given href and label", () => {
        render(<ArrowLink href="#record">See what I do</ArrowLink>);

        const link = screen.getByRole("link", { name: /see what i do/i });

        expect(link).toHaveAttribute("href", "#record");
    });

    it("defaults to the primary hover color", () => {
        render(<ArrowLink href="#top">Label</ArrowLink>);

        expect(screen.getByRole("link")).toHaveClass("hover:text-primary");
    });

    it.each([
        ["accent", "hover:text-accent"],
        ["secondary", "hover:text-secondary"],
        ["success", "hover:text-success"],
        ["primary", "hover:text-primary"],
    ] as const)("applies the %s hover color", (hover, expectedClass) => {
        render(
            <ArrowLink href="#top" hover={hover}>
                Label
            </ArrowLink>,
        );

        expect(screen.getByRole("link")).toHaveClass(expectedClass);
    });

    it("keeps the group class so the arrow can animate on hover", () => {
        render(<ArrowLink href="#top">Label</ArrowLink>);

        expect(screen.getByRole("link")).toHaveClass("group");
    });

    it("renders a decorative arrow icon", () => {
        const { container } = render(<ArrowLink href="#top">Label</ArrowLink>);

        expect(
            container.querySelector("svg.lucide-arrow-down-right"),
        ).toBeInTheDocument();
    });
});

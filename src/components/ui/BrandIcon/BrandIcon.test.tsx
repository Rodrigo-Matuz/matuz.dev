import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import BrandIcon from './BrandIcon';
import { isBrandIconName } from './brandGlyphs';

describe('BrandIcon', () => {
    it('renders an svg for each known brand', () => {
        const { container } = render(<BrandIcon name="github" />);

        const svg = container.firstElementChild;

        expect(svg?.tagName).toBe('svg');
        expect(svg).toHaveAttribute('viewBox', '0 0 16 16');
        expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('scales through the size prop', () => {
        const { container } = render(<BrandIcon name="linkedin" size={22} />);

        const svg = container.firstElementChild as SVGSVGElement;

        expect(svg).toHaveAttribute('width', '22');
        expect(svg).toHaveAttribute('height', '22');
    });

    it('inherits the parent text color via currentColor', () => {
        const { container } = render(<BrandIcon name="rss" />);

        expect(container.firstElementChild).toHaveAttribute(
            'fill',
            'currentColor',
        );
    });

    it('narrow the icon name type for content-driven lookups', () => {
        expect(isBrandIconName('github')).toBe(true);
        expect(isBrandIconName('linkedin')).toBe(true);
        expect(isBrandIconName('rss')).toBe(true);
        expect(isBrandIconName('unknown')).toBe(false);
    });
});

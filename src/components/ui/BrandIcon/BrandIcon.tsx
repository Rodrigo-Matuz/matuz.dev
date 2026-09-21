import type { SVGProps } from 'react';

import { glyphs, type BrandIconName } from './brandGlyphs';

interface BrandIconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
    name: BrandIconName;
    size?: number;
}

export function BrandIcon({ name, size = 16, ...props }: BrandIconProps) {
    const glyph = glyphs[name];

    return (
        <svg
            viewBox={glyph.viewBox}
            width={size}
            height={size}
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
            {...props}
        >
            <path d={glyph.path} />
        </svg>
    );
}

export default BrandIcon;

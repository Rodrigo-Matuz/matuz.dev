import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Footer from './Footer';
import { locales } from '$/content';

describe('Footer', () => {
    it('renders the owner name', () => {
        render(<Footer language="en" />);

        expect(
            screen.getByText(locales.en.owner.displayName),
        ).toBeInTheDocument();
    });

    it('renders the localized footer text with the current year', () => {
        render(<Footer language="en" />);

        const year = new Date().getFullYear().toString();

        expect(screen.getByText(/built by rodrigo-matuz/i)).toHaveTextContent(
            year,
        );
    });

    it('localizes the footer text per language', () => {
        render(<Footer language="pt-BR" />);

        expect(screen.getByText(/feito por rodrigo-matuz/i)).toBeInTheDocument();
    });

    it('renders as a footer landmark', () => {
        render(<Footer language="en" />);

        expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });
});

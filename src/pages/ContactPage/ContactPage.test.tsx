import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { ContactPage } from './ContactPage';
import { locales } from '$/content';

// jsdom lacks IntersectionObserver, which Motion's whileInView uses.
beforeAll(() => {
    class MockIntersectionObserver implements IntersectionObserver {
        readonly root = null;
        readonly rootMargin = '';
        readonly scrollMargin = '';
        readonly thresholds = [];
        disconnect() {}
        observe() {}
        unobserve() {}
        takeRecords(): IntersectionObserverEntry[] {
            return [];
        }
    }

    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
});

// PageShell's Header reads the router location; pages must render inside one.
const renderPage = () =>
    render(
        <MemoryRouter>
            <ContactPage />
        </MemoryRouter>,
    );

/**
 * Channels render through SafeLink (anti-scraping): the href only exists in
 * the DOM after hover/touch/focus. Reveal every link before asserting.
 */
const revealChannelLinks = async () => {
    const user = userEvent.setup();

    for (const link of getChannelLinks()) {
        await user.hover(link);
    }
};

/**
 * The header also renders social links with the same hrefs (icon-only, no
 * target). Channel assertions must look inside the channel list only.
 */
const getChannelLinks = () =>
    screen.getAllByRole('listitem').flatMap((item) =>
        Array.from(item.querySelectorAll('a')),
    );

describe('ContactPage', () => {
    it('renders the page title from the default locale (pt-BR)', () => {
        renderPage();

        const heading = screen.getByRole('heading', { level: 1 });

        expect(heading).toHaveTextContent(locales['pt-BR'].contact.title);
    });

    it('renders every contact channel with its value and note', () => {
        renderPage();

        const { channels } = locales['pt-BR'].contact;

        for (const channel of channels) {
            expect(screen.getByText(channel.value)).toBeInTheDocument();
            expect(screen.getByText(channel.note)).toBeInTheDocument();
        }
    });

    it('links every channel to its href', async () => {
        renderPage();

        await revealChannelLinks();

        const { channels } = locales['pt-BR'].contact;
        const links = getChannelLinks();

        for (const channel of channels) {
            const link = links.find(
                (candidate) => candidate.getAttribute('href') === channel.href,
            );

            expect(link, channel.id).toBeDefined();
        }
    });

    it('opens external channels in a new tab but keeps mailto in-tab', async () => {
        renderPage();

        await revealChannelLinks();

        const { channels } = locales['pt-BR'].contact;
        const links = getChannelLinks();

        for (const channel of channels) {
            const link = links.find(
                (candidate) => candidate.getAttribute('href') === channel.href,
            );

            expect(link, channel.id).toBeDefined();

            if (channel.href.startsWith('http')) {
                expect(link).toHaveAttribute('target', '_blank');
            } else {
                expect(link).not.toHaveAttribute('target');
            }
        }
    });

    it('lists the Discord handle with the profile link', async () => {
        renderPage();

        await revealChannelLinks();

        const discord = locales['pt-BR'].contact.channels.find(
            (channel) => channel.id === 'discord',
        );

        expect(discord?.value).toBe('@matuz');

        const link = getChannelLinks().find(
            (candidate) => candidate.getAttribute('href') === discord?.href,
        );

        expect(link).toBeDefined();
        expect(link).toHaveTextContent('@matuz');
    });

    it('explains the email preference and the catch-all domain', () => {
        renderPage();

        const { contact } = locales['pt-BR'];

        expect(screen.getByText(contact.emailNote)).toBeInTheDocument();
        expect(screen.getByText(contact.discordNote)).toBeInTheDocument();
    });

    it('renders the closing action with the real email', async () => {
        renderPage();

        const action = screen.getByRole('link', {
            name: new RegExp(
                locales['pt-BR'].correspondence.primaryAction,
                'i',
            ),
        });

        // SafeLink: the href appears on hover.
        await userEvent.setup().hover(action);

        expect(action).toHaveAttribute(
            'href',
            locales['pt-BR'].correspondence.emailHref,
        );
    });

    it('renders the footer with the owner name', () => {
        renderPage();

        const footer = screen.getByRole('contentinfo');

        expect(footer).toHaveTextContent(
            locales['pt-BR'].owner.displayName,
        );
    });
});

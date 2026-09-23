import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { NoteSidebar } from './NoteSidebar';
import { locales } from '$/content';
import type { NoteIndexEntry } from '$/lib/notes';

const notes: NoteIndexEntry[] = [
    {
        slug: 'dev/first-note',
        id: 'a1b2c3d4',
        title: 'First note',
        created: null,
        updated: null,
    },
    {
        slug: 'second-note',
        id: 'e5f6a7b8',
        title: 'Second note',
        created: null,
        updated: null,
    },
];

const renderSidebar = () =>
    render(
        <MemoryRouter>
            <NoteSidebar notes={notes} />
        </MemoryRouter>,
    );

describe('NoteSidebar', () => {
    it('renders the dropdown trigger with menu linkage', () => {
        renderSidebar();

        const trigger = screen.getByRole('button');

        expect(trigger).toHaveAttribute('aria-expanded', 'false');
        expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
        expect(trigger).toHaveAttribute('aria-controls', 'notes-menu');
    });

    it('opens the menu on click and lists every note', async () => {
        const user = userEvent.setup();
        renderSidebar();

        await user.click(screen.getByRole('button'));

        const menu = screen.getByRole('menu', {
            name: locales['pt-BR'].notes.eyebrow,
        });

        expect(menu).toHaveAttribute('id', 'notes-menu');

        for (const note of notes) {
            expect(
                screen.getByRole('menuitem', { name: note.title }),
            ).toBeInTheDocument();
        }
    });

    it('returns focus to the trigger when closed with Escape', async () => {
        const user = userEvent.setup();
        renderSidebar();

        const trigger = screen.getByRole('button');

        await user.click(trigger);
        expect(trigger).toHaveAttribute('aria-expanded', 'true');

        await user.keyboard('{Escape}');

        expect(trigger).toHaveAttribute('aria-expanded', 'false');
        expect(trigger).toHaveFocus();
    });
});

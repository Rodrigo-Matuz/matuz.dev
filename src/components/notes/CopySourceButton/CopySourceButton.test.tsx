import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import CopySourceButton from './CopySourceButton';

const SOURCE = '# Heading\n\nBody text with `code`.';

describe('CopySourceButton', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('renders the idle copy label', () => {
        render(<CopySourceButton content={SOURCE} title="My note" />);

        expect(
            screen.getByRole('button', { name: /copiar fonte — my note/i }),
        ).toHaveTextContent('Copiar fonte');
    });

    it('puts the full raw source on the clipboard', async () => {
        const user = userEvent.setup();
        const writeText = vi.fn().mockResolvedValue(undefined);

        vi.stubGlobal('navigator', {
            ...navigator,
            clipboard: { writeText },
        });

        render(<CopySourceButton content={SOURCE} title="My note" />);

        await user.click(screen.getByRole('button', { name: /copiar fonte/i }));

        await waitFor(() => {
            expect(writeText).toHaveBeenCalledWith(SOURCE);
        });
    });

    it('shows the copied state, then resets', async () => {
        vi.useFakeTimers();
        const writeText = vi.fn().mockResolvedValue(undefined);

        vi.stubGlobal('navigator', {
            ...navigator,
            clipboard: { writeText },
        });

        render(<CopySourceButton content={SOURCE} title="My note" />);

        const button = screen.getByRole('button', { name: /copiar fonte/i });

        button.click();

        await vi.waitFor(() => {
            expect(button).toHaveTextContent('Copiado');
        });

        vi.advanceTimersByTime(2100);

        await vi.waitFor(() => {
            expect(button).toHaveTextContent('Copiar fonte');
        });

        vi.useRealTimers();
    });

    it('shows the failed state when the clipboard rejects', async () => {
        const user = userEvent.setup();
        const writeText = vi.fn().mockRejectedValue(new Error('denied'));

        vi.stubGlobal('navigator', {
            ...navigator,
            clipboard: { writeText },
        });
        // jsdom does not implement execCommand — stub it directly.
        Object.defineProperty(document, 'execCommand', {
            configurable: true,
            value: vi.fn().mockReturnValue(false),
        });

        render(<CopySourceButton content={SOURCE} title="My note" />);

        await user.click(screen.getByRole('button', { name: /copiar fonte/i }));

        await waitFor(() => {
            expect(
                screen.getByRole('button', { name: /falhou/i }),
            ).toHaveTextContent('Falhou');
        });
    });

    it('falls back to execCommand when the Clipboard API is missing', async () => {
        const user = userEvent.setup();
        const execCommand = vi.fn().mockReturnValue(true);

        vi.stubGlobal('navigator', { ...navigator });
        Object.defineProperty(navigator, 'clipboard', {
            configurable: true,
            get() {
                throw new Error('not allowed');
            },
        });
        Object.defineProperty(document, 'execCommand', {
            configurable: true,
            value: execCommand,
        });

        render(<CopySourceButton content={SOURCE} title="My note" />);

        await user.click(screen.getByRole('button', { name: /copiar fonte/i }));

        await waitFor(() => {
            expect(execCommand).toHaveBeenCalledWith('copy');
        });
    });
});

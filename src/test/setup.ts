import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

import { setLanguage } from '$/lib/language';

afterEach(() => {
    cleanup();

    // The language store is module-level; reset it so test isolation holds.
    setLanguage('pt-BR');
    document.documentElement.lang = 'pt-BR';
});

import english from './eng.json'
import portugueseBrazil from './pt-br.json'

export const locales = {
  en: english,
  'pt-BR': portugueseBrazil,
} as const

export type Language = keyof typeof locales

import type { Language } from '../../interfaces/core/translation';

export const LANGUAGES: readonly [Language, Language] = ['uk', 'en'];

export const LANGUAGE_NAMES: Record<Language, string> = {
  uk: 'Українська',
  en: 'English',
};

export const isLanguage = (value: unknown): value is Language => LANGUAGES.includes(value as Language);

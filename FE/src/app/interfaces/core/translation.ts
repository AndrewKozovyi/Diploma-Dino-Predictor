import type { AppEnvironment } from './app-environment';

export type Culture = AppEnvironment['defaultCulture'];

export type TranslationDictionary = Record<string, string>;

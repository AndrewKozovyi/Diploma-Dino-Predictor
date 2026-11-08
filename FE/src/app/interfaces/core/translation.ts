import type { AppEnvironment } from './app-environment';

export type Language = AppEnvironment['defaultLanguage'];

export type TranslationDictionary = Record<string, string>;

export type TranslationParams = Record<string, string | number>;

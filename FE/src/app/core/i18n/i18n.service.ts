import { DOCUMENT, inject, Injectable, isDevMode, signal } from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';

import type { Language, TranslationDictionary, TranslationParams } from '../../interfaces/core/translation';
import { APP_CONFIG } from '../config/app-config';
import { isLanguage } from './languages';
import { TranslationLoader } from './translation-loader';

const STORAGE_KEY = 'language';
const PARAM_PATTERN = /\{(\w+)\}/g;

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly loader = inject(TranslationLoader);
  private readonly document = inject(DOCUMENT);
  private readonly defaultLanguage = inject(APP_CONFIG).defaultLanguage;
  private readonly languageState = signal<Language>(this.detectLanguage());
  private readonly dictionary = signal<TranslationDictionary>({});
  private readonly missingKeys = new Set<string>();
  private switching?: Subscription;

  readonly language = this.languageState.asReadonly();

  init(): Observable<void> {
    return this.apply(this.language());
  }

  use(language: Language): void {
    this.switching?.unsubscribe();

    if (language === this.language()) {
      return;
    }

    this.switching = this.apply(language).subscribe(() => localStorage.setItem(STORAGE_KEY, language));
  }

  has(key: string): boolean {
    return key in this.dictionary();
  }

  t(key: string, params?: TranslationParams): string {
    const text = this.dictionary()[key];

    if (text === undefined) {
      this.warnMissing(key);

      return key;
    }

    return params ? text.replace(PARAM_PATTERN, (match, name: string) => String(params[name] ?? match)) : text;
  }

  private apply(language: Language): Observable<void> {
    return this.loader.load(language).pipe(
      map((dictionary) => {
        this.dictionary.set(dictionary);
        this.languageState.set(language);
        this.missingKeys.clear();
        this.document.documentElement.lang = language;
      }),
    );
  }

  private detectLanguage(): Language {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (isLanguage(saved)) {
      return saved;
    }

    const browserLanguage = navigator.languages.map((language) => language.slice(0, 2)).find(isLanguage);

    return browserLanguage ?? this.defaultLanguage;
  }

  private warnMissing(key: string): void {
    if (isDevMode() && !this.missingKeys.has(key)) {
      this.missingKeys.add(key);
      console.warn(`Missing translation for "${key}" in "${this.language()}"`);
    }
  }
}

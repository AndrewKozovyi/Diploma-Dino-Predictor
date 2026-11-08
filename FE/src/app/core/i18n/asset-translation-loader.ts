import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

import type { Language, TranslationDictionary } from '../../interfaces/core/translation';
import { TranslationLoader } from './translation-loader';

@Injectable()
export class AssetTranslationLoader extends TranslationLoader {
  private readonly http = inject(HttpClient);

  load(language: Language): Observable<TranslationDictionary> {
    return this.http.get<TranslationDictionary>(`/i18n/${language}.json`).pipe(catchError(() => of({})));
  }
}

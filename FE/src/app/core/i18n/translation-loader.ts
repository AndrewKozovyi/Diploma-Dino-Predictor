import { Observable } from 'rxjs';

import type { Language, TranslationDictionary } from '../../interfaces/core/translation';

export abstract class TranslationLoader {
  abstract load(language: Language): Observable<TranslationDictionary>;
}

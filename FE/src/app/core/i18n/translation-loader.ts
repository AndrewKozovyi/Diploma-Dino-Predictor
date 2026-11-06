import { Observable } from 'rxjs';

import type { Culture, TranslationDictionary } from '../../interfaces/core/translation';

export abstract class TranslationLoader {
  abstract load(culture: Culture): Observable<TranslationDictionary>;
}

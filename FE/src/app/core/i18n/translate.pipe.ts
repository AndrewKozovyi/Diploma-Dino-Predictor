import { inject, Pipe, PipeTransform } from '@angular/core';

import type { TranslationParams } from '../../interfaces/core/translation';
import { I18nService } from './i18n.service';

@Pipe({ name: 't', pure: false })
export class TranslatePipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(key: string, params?: TranslationParams): string {
    return this.i18n.t(key, params);
  }
}

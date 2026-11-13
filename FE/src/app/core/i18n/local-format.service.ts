import { computed, inject, Injectable } from '@angular/core';

import { I18nService } from './i18n.service';

@Injectable({ providedIn: 'root' })
export class LocalFormatService {
  private readonly i18n = inject(I18nService);
  private readonly dateFormat = computed(
    () => new Intl.DateTimeFormat(this.i18n.language(), { dateStyle: 'medium', timeStyle: 'short' }),
  );
  private readonly percentFormat = computed(
    () => new Intl.NumberFormat(this.i18n.language(), { style: 'percent', maximumFractionDigits: 1 }),
  );

  date(value: string): string {
    return this.dateFormat().format(new Date(value));
  }

  percent(value: number): string {
    return this.percentFormat().format(value);
  }
}

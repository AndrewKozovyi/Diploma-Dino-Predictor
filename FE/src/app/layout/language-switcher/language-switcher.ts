import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { I18nService } from '../../core/i18n/i18n.service';
import { LANGUAGE_NAMES, LANGUAGES } from '../../core/i18n/languages';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-language-switcher',
  imports: [TranslatePipe],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcher {
  private readonly i18n = inject(I18nService);

  protected readonly languages = LANGUAGES;
  protected readonly activeIndex = computed(() => LANGUAGES.indexOf(this.i18n.language()));
  protected readonly next = computed(() => LANGUAGES[(this.activeIndex() + 1) % LANGUAGES.length]);
  protected readonly nextName = computed(() => LANGUAGE_NAMES[this.next()]);

  protected toggle(): void {
    this.i18n.use(this.next());
  }
}

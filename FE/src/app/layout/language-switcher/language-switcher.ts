import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { I18nService } from '../../core/i18n/i18n.service';
import { LANGUAGE_NAMES, LANGUAGES } from '../../core/i18n/languages';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import type { Language } from '../../interfaces/core/translation';
import type { SwitcherOption, SwitcherOptions } from '../../interfaces/shared/switcher-option';
import { Switcher } from '../../shared/ui/switcher/switcher';

const toOption = (language: Language): SwitcherOption<Language> => ({
  value: language,
  label: language.toUpperCase(),
  title: LANGUAGE_NAMES[language],
});

@Component({
  selector: 'app-language-switcher',
  imports: [Switcher, TranslatePipe],
  templateUrl: './language-switcher.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcher {
  protected readonly i18n = inject(I18nService);

  protected readonly options: SwitcherOptions<Language> = [toOption(LANGUAGES[0]), toOption(LANGUAGES[1])];
}

import { EnvironmentProviders, inject, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';

import { AssetTranslationLoader } from './asset-translation-loader';
import { I18nService } from './i18n.service';
import { TranslationLoader } from './translation-loader';

export const provideI18n = (): EnvironmentProviders =>
  makeEnvironmentProviders([
    { provide: TranslationLoader, useClass: AssetTranslationLoader },
    provideAppInitializer(() => inject(I18nService).init()),
  ]);

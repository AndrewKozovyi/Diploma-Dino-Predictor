import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { DinoTypesApi } from './dino-types-api';
import { DinoTypesHttpApi } from './dino-types-http-api';

export const provideDinoTypesApi = (): EnvironmentProviders =>
  makeEnvironmentProviders([{ provide: DinoTypesApi, useClass: DinoTypesHttpApi }]);

import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { PredictionsApi } from './predictions-api';
import { PredictionsHttpApi } from './predictions-http-api';

export const providePredictionsApi = (): EnvironmentProviders =>
  makeEnvironmentProviders([{ provide: PredictionsApi, useClass: PredictionsHttpApi }]);

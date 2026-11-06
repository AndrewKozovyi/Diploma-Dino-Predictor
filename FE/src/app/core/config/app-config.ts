import { InjectionToken } from '@angular/core';

import type { AppEnvironment } from '../../interfaces/core/app-environment';

export const APP_CONFIG = new InjectionToken<AppEnvironment>('APP_CONFIG');

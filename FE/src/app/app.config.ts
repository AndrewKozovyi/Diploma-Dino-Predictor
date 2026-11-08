import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  RedirectCommand,
  Router,
  withComponentInputBinding,
  withInMemoryScrolling,
  withNavigationErrorHandler,
} from '@angular/router';

import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { APP_CONFIG } from './core/config/app-config';
import { acceptLanguageInterceptor } from './core/http/accept-language.interceptor';
import { apiUrlInterceptor } from './core/http/api-url.interceptor';
import { errorInterceptor } from './core/http/error.interceptor';
import { provideI18n } from './core/i18n/provide-i18n';
import { providePredictionsApi } from './domain/prediction/data-access/provide-predictions-api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
      withNavigationErrorHandler(
        () => new RedirectCommand(inject(Router).parseUrl('/error'), { skipLocationChange: true }),
      ),
    ),
    provideHttpClient(withFetch(), withInterceptors([apiUrlInterceptor, acceptLanguageInterceptor, errorInterceptor])),
    { provide: APP_CONFIG, useValue: environment },
    provideI18n(),
    providePredictionsApi(),
  ],
};

import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import type { ProblemDetails } from '../../interfaces/core/problem-details';
import { APP_CONFIG } from '../config/app-config';
import { I18nService } from '../i18n/i18n.service';
import { NotificationService } from '../notifications/notification.service';

const describeError = (error: unknown, i18n: I18nService): string => {
  if (!(error instanceof HttpErrorResponse)) {
    return i18n.t('errors.unexpected');
  }

  if (error.status === 0) {
    return i18n.t('errors.network');
  }

  const problem = error.error as ProblemDetails | null;
  const key = `errors.${problem?.code}`;

  return problem?.code && i18n.has(key) ? i18n.t(key, problem.params) : i18n.t('errors.unexpected');
};

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith(inject(APP_CONFIG).apiUrl)) {
    return next(request);
  }

  const notifications = inject(NotificationService);
  const i18n = inject(I18nService);

  return next(request).pipe(
    catchError((error: unknown) => {
      notifications.error(describeError(error, i18n));

      return throwError(() => error);
    }),
  );
};

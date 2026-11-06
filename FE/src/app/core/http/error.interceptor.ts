import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import type { ProblemDetails } from '../../interfaces/core/problem-details';
import { APP_CONFIG } from '../config/app-config';
import { NotificationService } from '../notifications/notification.service';

const UNEXPECTED_ERROR = 'Something went wrong. Please try again.';

const describeError = (error: unknown): string => {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      return "Can't reach the server. Check your connection.";
    }

    const problem = error.error as ProblemDetails | null;

    return problem?.detail ?? problem?.title ?? UNEXPECTED_ERROR;
  }

  return UNEXPECTED_ERROR;
};

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith(inject(APP_CONFIG).apiUrl)) {
    return next(request);
  }

  const notifications = inject(NotificationService);

  return next(request).pipe(
    catchError((error: unknown) => {
      notifications.error(describeError(error));

      return throwError(() => error);
    }),
  );
};

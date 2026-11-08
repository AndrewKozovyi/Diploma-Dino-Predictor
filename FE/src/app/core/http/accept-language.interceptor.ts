import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { APP_CONFIG } from '../config/app-config';
import { I18nService } from '../i18n/i18n.service';

export const acceptLanguageInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith(inject(APP_CONFIG).apiUrl)) {
    return next(request);
  }

  return next(request.clone({ setHeaders: { 'Accept-Language': inject(I18nService).language() } }));
};

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { APP_CONFIG } from '../config/app-config';

const isApiPath = (url: string): boolean => !url.startsWith('/') && !/^[a-z][a-z\d+.-]*:/i.test(url);

export const apiUrlInterceptor: HttpInterceptorFn = (request, next) => {
  if (!isApiPath(request.url)) {
    return next(request);
  }

  return next(request.clone({ url: `${inject(APP_CONFIG).apiUrl}/${request.url}` }));
};

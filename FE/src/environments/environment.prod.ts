import type { environment as prod } from './environment';

export const environment: typeof prod = {
  production: false,
  apiUrl: '/api',
};

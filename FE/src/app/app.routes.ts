import { isDevMode } from '@angular/core';
import { Routes } from '@angular/router';

import { ErrorPage } from './features/error-page/error-page';
import { Layout } from './layout/layout';

const devRoutes: Routes = [
  {
    path: 'ui-test',
    title: 'UI test',
    loadComponent: () => import('./features/ui-test/ui-test').then((m) => m.UiTest),
  },
  {
    path: 'ui-test/broken',
    loadComponent: () => Promise.reject(new Error('Broken route')),
  },
];

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        pathMatch: 'full',
        title: 'Dino Predictor',
        loadComponent: () => import('./features/home/home').then((m) => m.Home),
      },
      {
        path: 'history',
        title: 'History',
        loadComponent: () => import('./features/history/history').then((m) => m.History),
      },
      ...(isDevMode() ? devRoutes : []),
      {
        path: 'error',
        title: 'Something went wrong',
        component: ErrorPage,
        data: { code: 500 },
      },
      {
        path: '**',
        title: 'Page not found',
        component: ErrorPage,
        data: { code: 404 },
      },
    ],
  },
];

import { DestroyRef, inject, Signal, signal } from '@angular/core';

export const mediaQuery = (query: string): Signal<boolean> => {
  const list = matchMedia(query);
  const matches = signal(list.matches);
  const update = (event: MediaQueryListEvent): void => matches.set(event.matches);

  list.addEventListener('change', update);
  inject(DestroyRef).onDestroy(() => list.removeEventListener('change', update));

  return matches.asReadonly();
};

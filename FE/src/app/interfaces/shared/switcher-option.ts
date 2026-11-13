import type { SelectOption } from './select-option';

export interface SwitcherOption<T> extends SelectOption<T> {
  title?: string;
}

export type SwitcherOptions<T> = readonly [SwitcherOption<T>, SwitcherOption<T>];

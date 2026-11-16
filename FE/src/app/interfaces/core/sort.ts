export type SortDirection = 'asc' | 'desc';

export interface Sort {
  key: string;
  direction: SortDirection;
}

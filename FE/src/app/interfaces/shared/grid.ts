import type { Type } from '@angular/core';

export type GridTextStyle = 'strong' | 'muted';

export interface GridComponentCell<T> {
  component: Type<unknown>;
  inputs: (row: T) => Record<string, unknown>;
}

interface GridColumnBase {
  headerKey: string;
  width?: string;
}

export interface GridTextColumn<T> extends GridColumnBase {
  value: (row: T) => string;
  style?: GridTextStyle;
}

export type GridColumn<T> = GridTextColumn<T> | (GridColumnBase & GridComponentCell<T>);

export interface GridSchema<T> {
  columns: readonly GridColumn<T>[];
  card?: GridComponentCell<T>;
}

export interface GridCell {
  text?: string;
  style?: GridTextStyle;
  component?: Type<unknown>;
  inputs?: Record<string, unknown>;
}

export interface GridRow {
  key: unknown;
  cells: GridCell[];
  card?: GridCell;
}

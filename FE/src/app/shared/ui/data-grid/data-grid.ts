import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';

import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import type { Sort } from '../../../interfaces/core/sort';
import type { GridCell, GridColumn, GridComponentCell, GridRow } from '../../../interfaces/shared/grid';
import { mediaQuery } from '../../utils/media-query';
import { Icon } from '../icon/icon';
import { GridPagination } from './grid-pagination/grid-pagination';

const CARDS_QUERY = '(width < 600px)';
const DEFAULT_WIDTH = '1fr';
const DEFAULT_PAGE_SIZES = [10, 25, 50];

const toCell = <T>(column: GridColumn<T>, row: T): GridCell =>
  'value' in column
    ? { text: column.value(row), style: column.style }
    : { component: column.component, inputs: column.inputs(row) };

@Component({
  selector: 'app-data-grid',
  imports: [GridPagination, Icon, NgComponentOutlet, NgTemplateOutlet, TranslatePipe],
  templateUrl: './data-grid.html',
  styleUrl: './data-grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataGrid<T> {
  readonly rows = input.required<readonly T[]>();
  readonly columns = input.required<readonly GridColumn<T>[]>();
  readonly trackBy = input.required<(row: T) => unknown>();
  readonly label = input.required<string>();
  readonly card = input<GridComponentCell<T>>();
  readonly minRows = input(1);
  readonly usePagination = input(false, { transform: booleanAttribute });
  readonly page = model(1);
  readonly pageSize = model(DEFAULT_PAGE_SIZES[1]);
  readonly pageSizes = input<readonly number[]>(DEFAULT_PAGE_SIZES);
  readonly totalCount = input<number | null>(null);
  readonly sort = model<Sort | null>(null);
  readonly selectable = input(false, { transform: booleanAttribute });
  readonly rowSelect = output<T>();

  protected readonly cards = mediaQuery(CARDS_QUERY);
  protected readonly tracks = computed(() =>
    this.columns()
      .map((column) => column.width ?? DEFAULT_WIDTH)
      .join(' '),
  );
  protected readonly table = computed<GridRow<T>[]>(() => {
    const card = this.card();

    return this.rows().map((row) => ({
      row,
      key: this.trackBy()(row),
      cells: this.columns().map((column) => toCell(column, row)),
      card: card && { component: card.component, inputs: card.inputs(row) },
    }));
  });

  protected select(row: T, event?: Event): void {
    if (this.selectable()) {
      event?.preventDefault();
      this.rowSelect.emit(row);
    }
  }

  protected ariaSort(column: GridColumn<T>): string | null {
    if (!column.sortKey) {
      return null;
    }

    const sort = this.sort();

    if (sort?.key !== column.sortKey) {
      return 'none';
    }

    return sort.direction === 'asc' ? 'ascending' : 'descending';
  }

  protected toggleSort(key: string): void {
    const sort = this.sort();

    this.sort.set({ key, direction: sort?.key === key && sort.direction === 'desc' ? 'asc' : 'desc' });
  }
}

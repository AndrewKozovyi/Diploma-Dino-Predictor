import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import type { GridCell, GridColumn, GridComponentCell, GridRow } from '../../../interfaces/shared/grid';
import { mediaQuery } from '../../utils/media-query';

const CARDS_QUERY = '(width < 600px)';
const DEFAULT_WIDTH = '1fr';

const toCell = <T>(column: GridColumn<T>, row: T): GridCell =>
  'value' in column
    ? { text: column.value(row), style: column.style }
    : { component: column.component, inputs: column.inputs(row) };

@Component({
  selector: 'app-data-grid',
  imports: [NgComponentOutlet, NgTemplateOutlet, TranslatePipe],
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

  protected readonly cards = mediaQuery(CARDS_QUERY);
  protected readonly tracks = computed(() =>
    this.columns()
      .map((column) => column.width ?? DEFAULT_WIDTH)
      .join(' '),
  );
  protected readonly table = computed<GridRow[]>(() => {
    const card = this.card();

    return this.rows().map((row) => ({
      key: this.trackBy()(row),
      cells: this.columns().map((column) => toCell(column, row)),
      card: card && { component: card.component, inputs: card.inputs(row) },
    }));
  });
}

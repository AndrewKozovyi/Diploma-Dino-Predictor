import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';

import { TranslatePipe } from '../../../../core/i18n/translate.pipe';
import type { SelectOption } from '../../../../interfaces/shared/select-option';
import { Paginator } from '../../paginator/paginator';
import { Select } from '../../select/select';

@Component({
  selector: 'app-grid-pagination',
  imports: [Paginator, Select, TranslatePipe],
  templateUrl: './grid-pagination.html',
  styleUrl: './grid-pagination.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridPagination {
  readonly page = model.required<number>();
  readonly pageSize = model.required<number>();
  readonly pageSizes = input.required<readonly number[]>();
  readonly totalCount = input.required<number | null>();
  readonly shownCount = input.required<number>();

  protected readonly sizeOptions = computed<SelectOption<number>[]>(() =>
    this.pageSizes().map((size) => ({ value: size, label: `${size}` })),
  );
  protected readonly range = computed(() => {
    const from = (this.page() - 1) * this.pageSize() + 1;

    return { from, to: from + this.shownCount() - 1, count: this.totalCount() ?? 0 };
  });

  protected setPageSize(size: number | null): void {
    if (size !== null) {
      this.pageSize.set(size);
    }
  }
}

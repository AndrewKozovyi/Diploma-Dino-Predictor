import { ChangeDetectionStrategy, Component, computed, effect, inject, input, untracked } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';

import { I18nService } from '../../core/i18n/i18n.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { DinoTypesService } from '../../domain/dino-type/data-access/dino-types.service';
import { PredictionsService } from '../../domain/prediction/data-access/predictions.service';
import type { Sort } from '../../interfaces/core/sort';
import type { PredictionSummary } from '../../interfaces/domain/prediction';
import type { SelectOption } from '../../interfaces/shared/select-option';
import { DataGrid } from '../../shared/ui/data-grid/data-grid';
import { DateInput } from '../../shared/ui/date-input/date-input';
import { DinoLoader } from '../../shared/ui/dino-loader/dino-loader';
import { EmptyState } from '../../shared/ui/empty-state/empty-state';
import { Select } from '../../shared/ui/select/select';
import { injectHistoryGrid } from './history.schema';

const PAGE_SIZES: readonly number[] = [10, 25, 50];
const DEFAULT_PAGE_SIZE = 25;
const MIN_ROWS = 10;
const DEFAULT_SORT: Sort = { key: 'CreatedAt', direction: 'desc' };

type HistoryParam = 'type' | 'from' | 'to' | 'page' | 'size' | 'sort' | 'order';

const toPage = (value: string | undefined): number => Math.max(1, Math.trunc(Number(value)) || 1);
const toPageSize = (value: string | undefined): number =>
  PAGE_SIZES.includes(Number(value)) ? Number(value) : DEFAULT_PAGE_SIZE;

@Component({
  selector: 'app-history',
  imports: [DataGrid, DateInput, DinoLoader, EmptyState, RouterLink, Select, TranslatePipe],
  templateUrl: './history.html',
  styleUrl: './history.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class History {
  readonly type = input<string>();
  readonly from = input<string>();
  readonly to = input<string>();
  readonly page = input(1, { transform: toPage });
  readonly size = input(DEFAULT_PAGE_SIZE, { transform: toPageSize });
  readonly sort = input<string>();
  readonly order = input<string>();

  private readonly router = inject(Router);
  private readonly i18n = inject(I18nService);
  private readonly predictions = inject(PredictionsService);
  private readonly dinoTypes = inject(DinoTypesService);

  protected readonly minRows = MIN_ROWS;
  protected readonly grid = injectHistoryGrid();
  protected readonly pageSizes = PAGE_SIZES;
  protected readonly currentSort = computed<Sort>(() => {
    const sortable = this.grid.columns.some((column) => column.sortKey === this.sort());

    return sortable
      ? { key: this.sort() ?? DEFAULT_SORT.key, direction: this.order() === 'asc' ? 'asc' : 'desc' }
      : DEFAULT_SORT;
  });
  protected readonly filtered = computed(() => Boolean(this.type() || this.from() || this.to()));

  protected readonly results = rxResource({
    params: () => ({
      language: this.i18n.language(),
      query: {
        top: this.size(),
        skip: (this.page() - 1) * this.size(),
        dinoTypeCode: this.type(),
        from: this.from(),
        to: this.to(),
        sort: this.isDefaultSort(this.currentSort()) ? undefined : this.currentSort(),
      },
    }),
    stream: ({ params }) => this.predictions.getAll(params.query),
  });
  protected readonly items = computed(() => (this.results.hasValue() ? this.results.value().items : []));
  protected readonly count = computed(() => (this.results.hasValue() ? this.results.value().count : 0));

  private readonly types = rxResource({
    params: () => this.i18n.language(),
    stream: () => this.dinoTypes.getAll(),
  });
  protected readonly typeOptions = computed<SelectOption<string | null>[]>(() => [
    { value: null, label: this.i18n.t('history.filters.allTypes') },
    ...(this.types.hasValue() ? this.types.value() : []).map((type) => ({ value: type.code, label: type.name })),
  ]);

  protected readonly trackById = (prediction: PredictionSummary): string => prediction.id;

  constructor() {
    effect(() => {
      const lastPage = Math.max(1, Math.ceil(this.count() / this.size()));

      if (this.results.hasValue() && this.page() > lastPage) {
        untracked(() => this.navigate({ page: lastPage === 1 ? null : lastPage }, true));
      }
    });
  }

  protected filter(param: Exclude<HistoryParam, 'page' | 'size'>, value: string | null): void {
    this.navigate({ [param]: value, page: null });
  }

  protected goToPage(page: number): void {
    this.navigate({ page: page === 1 ? null : page });
  }

  protected setPageSize(size: number): void {
    this.navigate({ size: size === DEFAULT_PAGE_SIZE ? null : size, page: null });
  }

  protected setSort(sort: Sort | null): void {
    const custom = sort && !this.isDefaultSort(sort);

    this.navigate({ sort: custom ? sort.key : null, order: custom ? sort.direction : null, page: null });
  }

  protected reset(): void {
    this.navigate({ type: null, from: null, to: null, page: null });
  }

  private isDefaultSort(sort: Sort): boolean {
    return sort.key === DEFAULT_SORT.key && sort.direction === DEFAULT_SORT.direction;
  }

  private navigate(params: Partial<Record<HistoryParam, string | number | null>>, replaceUrl = false): void {
    void this.router.navigate([], { queryParams: params, queryParamsHandling: 'merge', replaceUrl });
  }
}

import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';

import { Icon } from '../icon/icon';

const SIBLING_PAGES = 1;

@Component({
  selector: 'app-paginator',
  imports: [Icon],
  templateUrl: './paginator.html',
  styleUrl: './paginator.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Paginator {
  readonly page = model.required<number>();
  readonly pageSize = input.required<number>();
  readonly totalCount = input.required<number>();

  protected readonly totalPages = computed(() => Math.ceil(this.totalCount() / this.pageSize()));

  protected readonly pages = computed(() => {
    const last = this.totalPages();
    const current = this.page();
    const pages: (number | null)[] = [];

    for (let page = 1; page <= last; page++) {
      if (page === 1 || page === last || Math.abs(page - current) <= SIBLING_PAGES) {
        pages.push(page);
      } else if (pages.at(-1) !== null) {
        pages.push(null);
      }
    }

    return pages;
  });
}

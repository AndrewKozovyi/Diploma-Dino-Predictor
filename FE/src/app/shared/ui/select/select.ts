import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  model,
  signal,
  untracked,
  viewChild,
} from '@angular/core';

import type { SelectOption } from '../../../interfaces/shared/select-option';
import { Icon } from '../icon/icon';

const PANEL_MAX_HEIGHT_PX = 240;

let nextId = 0;

@Component({
  selector: 'app-select',
  imports: [Icon],
  templateUrl: './select.html',
  styleUrl: './select.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Select<T> {
  readonly label = input.required<string>();
  readonly options = input.required<readonly SelectOption<T>[]>();
  readonly placeholder = input('Select');
  readonly value = model<T | null>(null);

  private readonly trigger = viewChild.required<ElementRef<HTMLButtonElement>>('trigger');
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');

  protected readonly id = `select-${nextId++}`;
  protected readonly isOpen = signal(false);
  protected readonly opensUp = signal(false);
  protected readonly activeIndex = signal(0);
  protected readonly selectedLabel = computed(
    () => this.options().find((option) => option.value === this.value())?.label ?? null,
  );

  constructor() {
    effect(() => {
      const index = this.activeIndex();
      const panel = this.panel();

      panel?.nativeElement.children.item(index)?.scrollIntoView({ block: 'nearest' });
    });

    effect(() => {
      if (!this.isOpen()) {
        return;
      }

      untracked(() => this.activeIndex.set(this.selectedIndex()));
    });
  }

  protected toggle(): void {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  protected close(): void {
    this.isOpen.set(false);
  }

  protected select(option: SelectOption<T>): void {
    this.value.set(option.value);
    this.close();
    this.trigger().nativeElement.focus();
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (!this.isOpen()) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        this.open();
      }

      return;
    }

    const last = this.options().length - 1;

    switch (event.key) {
      case 'ArrowDown':
        this.activeIndex.update((index) => Math.min(index + 1, last));
        break;
      case 'ArrowUp':
        this.activeIndex.update((index) => Math.max(index - 1, 0));
        break;
      case 'Home':
        this.activeIndex.set(0);
        break;
      case 'End':
        this.activeIndex.set(last);
        break;
      case 'Enter':
      case ' ':
        this.select(this.options()[this.activeIndex()]);
        break;
      case 'Escape':
        event.stopPropagation();
        this.close();
        break;
      default:
        return;
    }

    event.preventDefault();
  }

  private open(): void {
    const { top, bottom } = this.trigger().nativeElement.getBoundingClientRect();
    const spaceBelow = window.innerHeight - bottom;

    this.opensUp.set(spaceBelow < PANEL_MAX_HEIGHT_PX && top > spaceBelow);
    this.isOpen.set(true);
  }

  private selectedIndex(): number {
    return Math.max(
      this.options().findIndex((option) => option.value === this.value()),
      0,
    );
  }
}

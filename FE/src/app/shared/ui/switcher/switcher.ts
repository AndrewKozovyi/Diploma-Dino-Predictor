import { ChangeDetectionStrategy, Component, computed, ElementRef, input, model, viewChildren } from '@angular/core';

import type { SwitcherOptions } from '../../../interfaces/shared/switcher-option';

const ARROW_KEYS = new Set(['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp']);

@Component({
  selector: 'app-switcher',
  templateUrl: './switcher.html',
  styleUrl: './switcher.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(click)': 'toggle()' },
})
export class Switcher<T> {
  readonly options = input.required<SwitcherOptions<T>>();
  readonly value = model.required<T>();
  readonly label = input.required<string>();

  private readonly buttons = viewChildren<ElementRef<HTMLButtonElement>>('option');

  protected readonly activeIndex = computed(() => (this.options()[1].value === this.value() ? 1 : 0));

  protected toggle(): void {
    const next = 1 - this.activeIndex();

    this.value.set(this.options()[next].value);
    this.buttons()[next].nativeElement.focus();
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (ARROW_KEYS.has(event.key)) {
      event.preventDefault();
      this.toggle();
    }
  }
}

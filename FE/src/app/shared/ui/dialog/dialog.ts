import { ChangeDetectionStrategy, Component, effect, ElementRef, input, model, viewChild } from '@angular/core';

import { Icon } from '../icon/icon';

@Component({
  selector: 'app-dialog',
  imports: [Icon],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dialog {
  readonly heading = input.required<string>();
  readonly open = model(false);

  private readonly element = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    effect(() => {
      const dialog = this.element().nativeElement;

      if (this.open() && !dialog.open) {
        dialog.showModal();
      } else if (!this.open() && dialog.open) {
        dialog.close();
      }
    });
  }

  protected closeOnBackdrop(event: MouseEvent): void {
    if (event.target === this.element().nativeElement) {
      this.open.set(false);
    }
  }
}

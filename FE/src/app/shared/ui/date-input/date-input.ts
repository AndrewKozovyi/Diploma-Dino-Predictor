import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  model,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { Icon } from '../icon/icon';

const DISPLAY_DATE = /^(\d{2})\/(\d{2})\/(\d{4})$/;

let nextId = 0;

const toDisplay = (isoDate: string): string => isoDate.split('-').reverse().join('/');

const toIso = (text: string): string | null => {
  const match = DISPLAY_DATE.exec(text);

  if (!match) {
    return null;
  }

  const [, day, month, year] = match;
  const date = new Date(`${year}-${month}-${day}T00:00:00Z`);

  return date.getUTCDate() === Number(day) ? `${year}-${month}-${day}` : null;
};

@Component({
  selector: 'app-date-input',
  imports: [FormsModule, Icon, NgxMaskDirective, TranslatePipe],
  providers: [provideNgxMask()],
  templateUrl: './date-input.html',
  styleUrl: './date-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateInput {
  readonly label = input.required<string>();
  readonly value = model<string | null>(null);

  private readonly picker = viewChild.required<ElementRef<HTMLInputElement>>('picker');

  protected readonly id = `date-input-${nextId++}`;
  protected readonly text = signal('');
  protected readonly invalid = signal(false);

  constructor() {
    effect(() => {
      const value = this.value();

      untracked(() => {
        if (value !== null) {
          this.text.set(toDisplay(value));
          this.invalid.set(false);
        } else if (toIso(this.text()) !== null) {
          this.text.set('');
        }
      });
    });
  }

  protected onTextChange(text: string): void {
    this.text.set(text);
    this.invalid.set(false);
    this.value.set(toIso(text));
  }

  protected onBlur(): void {
    this.invalid.set(this.text() !== '' && toIso(this.text()) === null);
  }

  protected onPicked(): void {
    this.value.set(this.picker().nativeElement.value || null);
  }

  protected openPicker(): void {
    this.picker().nativeElement.showPicker();
  }
}

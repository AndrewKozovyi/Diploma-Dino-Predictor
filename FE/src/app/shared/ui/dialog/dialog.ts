import { DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { Icon } from '../icon/icon';

export const DIALOG_TITLE_ID = 'dialog-title';

@Component({
  selector: 'app-dialog',
  imports: [Icon, TranslatePipe],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dialog {
  readonly heading = input.required<string>();

  protected readonly titleId = DIALOG_TITLE_ID;
  protected readonly ref = inject(DialogRef);
}

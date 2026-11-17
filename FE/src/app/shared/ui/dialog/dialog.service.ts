import { Dialog as CdkDialog, type DialogConfig, type DialogRef } from '@angular/cdk/dialog';
import type { ComponentType } from '@angular/cdk/portal';
import { inject, Injectable, type TemplateRef } from '@angular/core';

import { DIALOG_TITLE_ID } from './dialog';

@Injectable({ providedIn: 'root' })
export class DialogService {
  private readonly dialog = inject(CdkDialog);

  open<R, D, C>(
    content: ComponentType<C> | TemplateRef<C>,
    config?: DialogConfig<D, DialogRef<R, C>>,
  ): DialogRef<R, C> {
    return this.dialog.open<R, D, C>(content, {
      ariaLabelledBy: DIALOG_TITLE_ID,
      backdropClass: 'dialog-backdrop',
      ...config,
    });
  }
}

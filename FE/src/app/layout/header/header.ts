import type { DialogRef } from '@angular/cdk/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal, type TemplateRef } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { DialogService } from '../../shared/ui/dialog/dialog.service';
import { Icon } from '../../shared/ui/icon/icon';
import { mediaQuery } from '../../shared/utils/media-query';
import { LanguageSwitcher } from '../language-switcher/language-switcher';

const MOBILE_QUERY = '(width < 600px)';
const DRAWER_TITLE_ID = 'drawer-title';

@Component({
  selector: 'app-header',
  imports: [Icon, LanguageSwitcher, NgTemplateOutlet, RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  private readonly dialog = inject(DialogService);
  private readonly overlay = inject(Overlay);
  private drawerRef: DialogRef | null = null;

  protected readonly mobile = mediaQuery(MOBILE_QUERY);
  protected readonly drawerClosing = signal(false);
  protected readonly drawerTitleId = DRAWER_TITLE_ID;

  constructor() {
    effect(() => {
      if (!this.mobile()) {
        this.drawerRef?.close();
      }
    });
  }

  protected openDrawer(template: TemplateRef<unknown>): void {
    this.drawerRef = this.dialog.open(template, {
      ariaLabelledBy: DRAWER_TITLE_ID,
      disableClose: true,
      height: '100%',
      positionStrategy: this.overlay.position().global().top('0').right('0'),
    });
    this.drawerRef.backdropClick.subscribe(() => this.closeDrawer());
    this.drawerRef.keydownEvents.subscribe((event) => {
      if (event.key === 'Escape') {
        this.closeDrawer();
      }
    });
    this.drawerRef.closed.subscribe(() => {
      this.drawerRef = null;
      this.drawerClosing.set(false);
    });
  }

  protected closeDrawer(): void {
    if (this.drawerRef) {
      this.drawerClosing.set(true);
    }
  }

  protected finishClosing(): void {
    if (this.drawerClosing()) {
      this.drawerRef?.close();
    }
  }
}

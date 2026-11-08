import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TranslatePipe } from '../../core/i18n/translate.pipe';
import type { ErrorPageCode, ErrorPageContent } from '../../interfaces/features/error-page';
import { Dino } from '../../shared/ui/dino/dino';

const CONTENT: Record<ErrorPageCode, ErrorPageContent> = {
  404: {
    heading: 'errorPage.notFound.heading',
    description: 'errorPage.notFound.description',
  },
  500: {
    heading: 'errorPage.serverError.heading',
    description: 'errorPage.serverError.description',
  },
};

@Component({
  selector: 'app-error-page',
  imports: [Dino, RouterLink, TranslatePipe],
  templateUrl: './error-page.html',
  styleUrl: './error-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPage {
  readonly code = input.required<ErrorPageCode>();

  protected readonly content = computed(() => CONTENT[this.code()]);

  protected reload(): void {
    window.location.reload();
  }
}

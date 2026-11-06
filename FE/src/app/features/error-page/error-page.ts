import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { ErrorPageCode, ErrorPageContent } from '../../interfaces/features/error-page';
import { Dino } from '../../shared/ui/dino/dino';

const CONTENT: Record<ErrorPageCode, ErrorPageContent> = {
  404: {
    heading: 'Page not found',
    description: "The page you're looking for doesn't exist or has moved.",
  },
  500: {
    heading: 'Something went wrong',
    description: "We couldn't load this page. Check your connection and try again.",
  },
};

@Component({
  selector: 'app-error-page',
  imports: [Dino, RouterLink],
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

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TranslatePipe } from '../../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-home-steps',
  imports: [TranslatePipe],
  templateUrl: './home-steps.html',
  styleUrl: './home-steps.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeSteps {
  protected readonly steps = ['upload', 'analyze', 'result'] as const;
}

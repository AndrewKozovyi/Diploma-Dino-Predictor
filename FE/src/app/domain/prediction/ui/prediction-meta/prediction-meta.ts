import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { LocalDatePipe } from '../../../../core/i18n/local-date.pipe';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';
import type { PredictionDetails } from '../../../../interfaces/domain/prediction';

@Component({
  selector: 'app-prediction-meta',
  imports: [LocalDatePipe, TranslatePipe],
  templateUrl: './prediction-meta.html',
  styleUrl: './prediction-meta.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PredictionMeta {
  readonly prediction = input.required<PredictionDetails>();
}

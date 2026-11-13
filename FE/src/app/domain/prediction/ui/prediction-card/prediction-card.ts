import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { LocalDatePipe } from '../../../../core/i18n/local-date.pipe';
import type { PredictionSummary } from '../../../../interfaces/domain/prediction';
import { ConfidenceMeter } from '../confidence-meter/confidence-meter';

@Component({
  selector: 'app-prediction-card',
  imports: [ConfidenceMeter, LocalDatePipe],
  templateUrl: './prediction-card.html',
  styleUrl: './prediction-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PredictionCard {
  readonly prediction = input.required<PredictionSummary>();
}

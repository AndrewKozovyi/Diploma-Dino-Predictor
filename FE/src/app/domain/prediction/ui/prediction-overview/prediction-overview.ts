import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { LocalPercentPipe } from '../../../../core/i18n/local-percent.pipe';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';
import type { PredictionCandidate } from '../../../../interfaces/domain/prediction';
import { Icon } from '../../../../shared/ui/icon/icon';
import { confidenceLevel } from '../../confidence';
import { ConfidenceMeter } from '../confidence-meter/confidence-meter';

@Component({
  selector: 'app-prediction-overview',
  imports: [ConfidenceMeter, Icon, LocalPercentPipe, TranslatePipe],
  templateUrl: './prediction-overview.html',
  styleUrl: './prediction-overview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PredictionOverview {
  readonly candidates = input.required<readonly PredictionCandidate[]>();

  protected readonly top = computed(() => this.candidates()[0]);
  protected readonly others = computed(() => this.candidates().slice(1));
  protected readonly unsure = computed(() => confidenceLevel(this.top().probability) === 'low');
}

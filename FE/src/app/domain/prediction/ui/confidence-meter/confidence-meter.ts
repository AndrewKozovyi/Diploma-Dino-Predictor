import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { LocalPercentPipe } from '../../../../core/i18n/local-percent.pipe';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';
import { confidenceLevel } from '../../confidence';

@Component({
  selector: 'app-confidence-meter',
  imports: [LocalPercentPipe, TranslatePipe],
  templateUrl: './confidence-meter.html',
  styleUrl: './confidence-meter.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'level()' },
})
export class ConfidenceMeter {
  readonly value = input.required<number>();
  readonly showValue = input(true);

  protected readonly level = computed(() => confidenceLevel(this.value()));
}

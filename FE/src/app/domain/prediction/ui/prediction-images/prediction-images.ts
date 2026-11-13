import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';

import { I18nService } from '../../../../core/i18n/i18n.service';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';
import type { SwitcherOptions } from '../../../../interfaces/shared/switcher-option';
import { Switcher } from '../../../../shared/ui/switcher/switcher';

type ImageView = 'photo' | 'cam';

@Component({
  selector: 'app-prediction-images',
  imports: [Switcher, TranslatePipe],
  templateUrl: './prediction-images.html',
  styleUrl: './prediction-images.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PredictionImages {
  readonly imageUrl = input.required<string>();
  readonly camImageUrl = input<string | null>(null);

  private readonly i18n = inject(I18nService);

  protected readonly view = signal<ImageView>('photo');
  protected readonly views = computed<SwitcherOptions<ImageView>>(() => [
    { value: 'photo', label: this.i18n.t('prediction.view.photo') },
    { value: 'cam', label: this.i18n.t('prediction.view.cam') },
  ]);
}

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { Dino } from '../dino/dino';

@Component({
  selector: 'app-dino-loader',
  imports: [Dino, TranslatePipe],
  templateUrl: './dino-loader.html',
  styleUrl: './dino-loader.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DinoLoader {
  readonly label = input<string>();
}

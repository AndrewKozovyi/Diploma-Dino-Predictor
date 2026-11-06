import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Dino } from '../dino/dino';

@Component({
  selector: 'app-dino-loader',
  imports: [Dino],
  templateUrl: './dino-loader.html',
  styleUrl: './dino-loader.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DinoLoader {
  readonly label = input('Loading…');
}

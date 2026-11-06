import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Icon } from '../icon/icon';

@Component({
  selector: 'app-dino',
  imports: [Icon],
  templateUrl: './dino.html',
  styleUrl: './dino.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dino {
  readonly size = input(66);
  readonly running = input(false);
  readonly crashed = input(false);
}

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-history',
  imports: [TranslatePipe],
  templateUrl: './history.html',
  styleUrl: './history.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class History {}

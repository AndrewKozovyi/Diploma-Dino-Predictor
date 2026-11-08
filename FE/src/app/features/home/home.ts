import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-home',
  imports: [TranslatePipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {}

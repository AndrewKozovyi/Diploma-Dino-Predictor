import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { Icon } from '../../shared/ui/icon/icon';
import { LanguageSwitcher } from '../language-switcher/language-switcher';

@Component({
  selector: 'app-header',
  imports: [Icon, LanguageSwitcher, RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {}

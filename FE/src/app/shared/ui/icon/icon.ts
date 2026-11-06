import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { IconName, ICONS } from './icon-index';

export { ICON_NAMES, type IconName } from './icon-index';

@Component({
  selector: 'app-icon',
  template: '',
  styleUrl: './icon.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
    '[class]': 'iconClass()',
    '[style.width.px]': 'size()',
    '[style.height.px]': 'size()',
  },
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(20);

  protected readonly iconClass = computed(() => ICONS[this.name()]);
}

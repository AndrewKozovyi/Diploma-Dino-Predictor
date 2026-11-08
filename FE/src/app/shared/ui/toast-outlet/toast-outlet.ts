import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { NotificationService } from '../../../core/notifications/notification.service';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-toast-outlet',
  imports: [Icon, TranslatePipe],
  templateUrl: './toast-outlet.html',
  styleUrl: './toast-outlet.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastOutlet {
  protected readonly notifications = inject(NotificationService);
}

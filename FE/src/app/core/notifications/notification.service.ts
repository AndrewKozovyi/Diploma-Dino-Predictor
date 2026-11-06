import { Injectable, signal } from '@angular/core';

import type {
  AppNotification,
  DismissTimer,
  NotificationOptions,
  NotificationType,
} from '../../interfaces/core/notification';

const DEFAULT_DURATION_MS = 3000;
const ERROR_DURATION_MS = 4500;

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly items = signal<AppNotification[]>([]);
  private readonly timers = new Map<number, DismissTimer>();
  private nextId = 1;

  readonly notifications = this.items.asReadonly();

  info(message: string, options?: NotificationOptions): number {
    return this.show('info', message, options);
  }

  success(message: string, options?: NotificationOptions): number {
    return this.show('success', message, options);
  }

  warning(message: string, options?: NotificationOptions): number {
    return this.show('warning', message, options);
  }

  error(message: string, options?: NotificationOptions): number {
    return this.show('error', message, { durationMs: ERROR_DURATION_MS, ...options });
  }

  dismiss(id: number): void {
    this.clearTimer(id);
    this.items.update((items) => items.filter((item) => item.id !== id));
  }

  pause(id: number): void {
    const timer = this.timers.get(id);

    if (timer) {
      clearTimeout(timer.handle);
      timer.remainingMs -= Date.now() - timer.startedAt;
    }
  }

  resume(id: number): void {
    const timer = this.timers.get(id);

    if (timer) {
      this.startTimer(id, timer.remainingMs);
    }
  }

  private show(type: NotificationType, message: string, options: NotificationOptions = {}): number {
    const id = this.nextId++;
    const durationMs = options.durationMs ?? DEFAULT_DURATION_MS;

    this.items.update((items) => [...items, { id, type, message, durationMs }]);
    this.startTimer(id, durationMs);

    return id;
  }

  private startTimer(id: number, remainingMs: number): void {
    const handle = setTimeout(() => this.dismiss(id), remainingMs);

    this.timers.set(id, { handle, startedAt: Date.now(), remainingMs });
  }

  private clearTimer(id: number): void {
    const timer = this.timers.get(id);

    if (timer) {
      clearTimeout(timer.handle);
      this.timers.delete(id);
    }
  }
}

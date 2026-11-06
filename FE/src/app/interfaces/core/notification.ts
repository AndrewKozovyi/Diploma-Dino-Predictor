export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface AppNotification {
  id: number;
  type: NotificationType;
  message: string;
  durationMs: number;
}

export interface NotificationOptions {
  durationMs?: number;
}

export interface DismissTimer {
  handle: ReturnType<typeof setTimeout>;
  startedAt: number;
  remainingMs: number;
}

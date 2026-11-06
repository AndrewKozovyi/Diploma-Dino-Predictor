export const ICONS = {
  calendar: 'icon-calendar',
  check: 'icon-check',
  'chevron-down': 'icon-chevron-down',
  'chevron-left': 'icon-chevron-left',
  'chevron-right': 'icon-chevron-right',
  close: 'icon-close',
  'dino-crashed': 'icon-dino-crashed',
  'dino-run-1': 'icon-dino-run-1',
  'dino-run-2': 'icon-dino-run-2',
  error: 'icon-error',
  history: 'icon-history',
  home: 'icon-home',
  image: 'icon-image',
  info: 'icon-info',
  success: 'icon-success',
  upload: 'icon-upload',
  warning: 'icon-warning',
} as const;

export type IconName = keyof typeof ICONS;

export const ICON_NAMES = Object.keys(ICONS) as IconName[];

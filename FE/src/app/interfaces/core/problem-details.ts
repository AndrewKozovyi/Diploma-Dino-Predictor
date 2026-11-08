import type { TranslationParams } from './translation';

export interface ProblemDetails {
  title?: string;
  detail?: string;
  code?: string;
  params?: TranslationParams;
}

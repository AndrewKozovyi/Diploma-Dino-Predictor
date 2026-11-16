import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import type { PredictionDetails, PredictionSummary } from '../../../interfaces/domain/prediction';
import type { Page } from '../../../interfaces/shared/page';

export abstract class PredictionsApi {
  abstract create(body: FormData): Observable<PredictionDetails>;
  abstract getAll(params: HttpParams): Observable<Page<PredictionSummary>>;
  abstract getById(id: string): Observable<PredictionDetails>;
}

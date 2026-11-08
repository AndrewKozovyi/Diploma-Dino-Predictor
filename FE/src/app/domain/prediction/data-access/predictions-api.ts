import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import type { PredictionDetails, PredictionSummary } from '../../../interfaces/domain/prediction';

export abstract class PredictionsApi {
  abstract create(body: FormData): Observable<PredictionDetails>;
  abstract getAll(params: HttpParams): Observable<PredictionSummary[]>;
  abstract getById(id: string): Observable<PredictionDetails>;
}

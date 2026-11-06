import { Observable } from 'rxjs';

import type { PredictionDetails, PredictionQuery, PredictionSummary } from '../../../interfaces/domain/prediction';

export abstract class PredictionsApi {
  abstract create(image: File): Observable<PredictionDetails>;
  abstract getAll(query: PredictionQuery): Observable<PredictionSummary[]>;
  abstract getById(id: string): Observable<PredictionDetails>;
}

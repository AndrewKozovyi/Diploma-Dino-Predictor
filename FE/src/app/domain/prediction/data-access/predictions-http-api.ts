import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import type { PredictionDetails, PredictionSummary } from '../../../interfaces/domain/prediction';
import type { Page } from '../../../interfaces/shared/page';
import { PredictionsApi } from './predictions-api';

const RESOURCE = 'Predictions';

@Injectable()
export class PredictionsHttpApi extends PredictionsApi {
  private readonly http = inject(HttpClient);

  create(body: FormData): Observable<PredictionDetails> {
    return this.http.post<PredictionDetails>(RESOURCE, body);
  }

  getAll(params: HttpParams): Observable<Page<PredictionSummary>> {
    return this.http.get<Page<PredictionSummary>>(RESOURCE, { params });
  }

  getById(id: string): Observable<PredictionDetails> {
    return this.http.get<PredictionDetails>(`${RESOURCE}/${encodeURIComponent(id)}`);
  }
}

import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ODataQuery } from '../../../core/http/odata-query';
import type { PredictionDetails, PredictionQuery, PredictionSummary } from '../../../interfaces/domain/prediction';
import { startOfLocalDay } from '../../../shared/utils/local-day';
import { PredictionsApi } from './predictions-api';

@Injectable({ providedIn: 'root' })
export class PredictionsService {
  private readonly api = inject(PredictionsApi);

  create(image: File): Observable<PredictionDetails> {
    const body = new FormData();
    body.append('image', image, image.name);

    return this.api.create(body);
  }

  getAll({ top, skip, dinoTypeCode, from, to }: PredictionQuery): Observable<PredictionSummary[]> {
    const params = new ODataQuery()
      .top(top)
      .skip(skip)
      .filter('DinoType/Code', 'eq', dinoTypeCode)
      .filter('CreatedAt', 'ge', from && startOfLocalDay(from))
      .filter('CreatedAt', 'lt', to && startOfLocalDay(to, 1))
      .toParams();

    return this.api.getAll(params);
  }

  getById(id: string): Observable<PredictionDetails> {
    return this.api.getById(id);
  }
}

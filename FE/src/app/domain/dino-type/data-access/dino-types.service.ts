import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import type { DinoType } from '../../../interfaces/domain/prediction';
import { DinoTypesApi } from './dino-types-api';

@Injectable({ providedIn: 'root' })
export class DinoTypesService {
  private readonly api = inject(DinoTypesApi);

  getAll(): Observable<DinoType[]> {
    return this.api.getAll();
  }
}

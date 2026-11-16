import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import type { DinoType } from '../../../interfaces/domain/prediction';
import { DinoTypesApi } from './dino-types-api';

const RESOURCE = 'DinoTypes';

@Injectable()
export class DinoTypesHttpApi extends DinoTypesApi {
  private readonly http = inject(HttpClient);

  getAll(): Observable<DinoType[]> {
    return this.http.get<DinoType[]>(RESOURCE);
  }
}

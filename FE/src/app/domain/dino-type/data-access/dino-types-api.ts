import { Observable } from 'rxjs';

import type { DinoType } from '../../../interfaces/domain/prediction';

export abstract class DinoTypesApi {
  abstract getAll(): Observable<DinoType[]>;
}

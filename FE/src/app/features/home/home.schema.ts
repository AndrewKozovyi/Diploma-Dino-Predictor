import { inject } from '@angular/core';

import { LocalFormatService } from '../../core/i18n/local-format.service';
import { ConfidenceMeter } from '../../domain/prediction/ui/confidence-meter/confidence-meter';
import { PredictionCard } from '../../domain/prediction/ui/prediction-card/prediction-card';
import type { PredictionSummary } from '../../interfaces/domain/prediction';
import type { GridSchema } from '../../interfaces/shared/grid';

export const injectLastPredictionsGrid = (): GridSchema<PredictionSummary> => {
  const format = inject(LocalFormatService);

  return {
    columns: [
      {
        headerKey: 'prediction.columns.dino',
        width: 'minmax(8rem, 1.2fr)',
        value: (prediction) => prediction.dinoType.name,
        style: 'strong',
      },
      {
        headerKey: 'prediction.columns.confidence',
        width: 'minmax(10rem, 1.2fr)',
        component: ConfidenceMeter,
        inputs: (prediction) => ({ value: prediction.probability }),
      },
      {
        headerKey: 'prediction.columns.file',
        width: 'minmax(0, 1fr)',
        value: (prediction) => prediction.originalFileName,
      },
      {
        headerKey: 'prediction.columns.date',
        width: '12rem',
        value: (prediction) => format.date(prediction.createdAt),
        style: 'muted',
      },
    ],
    card: { component: PredictionCard, inputs: (prediction) => ({ prediction }) },
  };
};

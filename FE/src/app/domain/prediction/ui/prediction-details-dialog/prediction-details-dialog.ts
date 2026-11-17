import { DIALOG_DATA } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { I18nService } from '../../../../core/i18n/i18n.service';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';
import type { PredictionDialogData } from '../../../../interfaces/domain/prediction';
import { Dialog } from '../../../../shared/ui/dialog/dialog';
import { DinoLoader } from '../../../../shared/ui/dino-loader/dino-loader';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PredictionsService } from '../../data-access/predictions.service';
import { PredictionImages } from '../prediction-images/prediction-images';
import { PredictionMeta } from '../prediction-meta/prediction-meta';
import { PredictionOverview } from '../prediction-overview/prediction-overview';

@Component({
  selector: 'app-prediction-details-dialog',
  imports: [Dialog, DinoLoader, EmptyState, PredictionImages, PredictionMeta, PredictionOverview, TranslatePipe],
  templateUrl: './prediction-details-dialog.html',
  styleUrl: './prediction-details-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PredictionDetailsDialog {
  private readonly data = inject<PredictionDialogData>(DIALOG_DATA);
  private readonly i18n = inject(I18nService);
  private readonly predictions = inject(PredictionsService);

  protected readonly prediction = rxResource({
    params: () => this.i18n.language(),
    stream: () => this.predictions.getById(this.data.predictionId),
  });
}

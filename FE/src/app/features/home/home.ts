import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { I18nService } from '../../core/i18n/i18n.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { PredictionsService } from '../../domain/prediction/data-access/predictions.service';
import type { PredictionSummary } from '../../interfaces/domain/prediction';
import { DataGrid } from '../../shared/ui/data-grid/data-grid';
import { DinoLoader } from '../../shared/ui/dino-loader/dino-loader';
import { EmptyState } from '../../shared/ui/empty-state/empty-state';
import { HomeSteps } from './components/home-steps/home-steps';
import { HomeUpload } from './components/home-upload/home-upload';
import { injectLastPredictionsGrid } from './home.schema';

const RECENT_COUNT = 10;

@Component({
  selector: 'app-home',
  imports: [DataGrid, DinoLoader, EmptyState, HomeSteps, HomeUpload, TranslatePipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private readonly predictions = inject(PredictionsService);
  private readonly i18n = inject(I18nService);

  protected readonly recentCount = RECENT_COUNT;
  protected readonly recentGrid = injectLastPredictionsGrid();
  protected readonly recent = rxResource({
    params: () => this.i18n.language(),
    stream: () => this.predictions.getAll({ top: RECENT_COUNT }),
  });
  protected readonly recentItems = computed(() => (this.recent.hasValue() ? this.recent.value() : []));
  protected readonly trackById = (prediction: PredictionSummary): string => prediction.id;
}

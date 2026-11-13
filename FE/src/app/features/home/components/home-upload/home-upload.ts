import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, output, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { filter, finalize, map, skip, switchMap } from 'rxjs';

import { I18nService } from '../../../../core/i18n/i18n.service';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';
import { PredictionsService } from '../../../../domain/prediction/data-access/predictions.service';
import { PredictionImages } from '../../../../domain/prediction/ui/prediction-images/prediction-images';
import { PredictionMeta } from '../../../../domain/prediction/ui/prediction-meta/prediction-meta';
import { PredictionOverview } from '../../../../domain/prediction/ui/prediction-overview/prediction-overview';
import type { PredictionDetails } from '../../../../interfaces/domain/prediction';
import { DinoLoader } from '../../../../shared/ui/dino-loader/dino-loader';
import { FileDrop } from '../../../../shared/ui/file-drop/file-drop';
import { Icon } from '../../../../shared/ui/icon/icon';

@Component({
  selector: 'app-home-upload',
  imports: [DinoLoader, FileDrop, Icon, PredictionImages, PredictionMeta, PredictionOverview, TranslatePipe],
  templateUrl: './home-upload.html',
  styleUrl: './home-upload.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeUpload {
  readonly predicted = output<PredictionDetails>();

  private readonly predictions = inject(PredictionsService);
  private readonly i18n = inject(I18nService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly file = signal<File | null>(null);
  protected readonly analyzing = signal(false);
  protected readonly result = signal<PredictionDetails | null>(null);

  constructor() {
    toObservable(this.i18n.language)
      .pipe(
        skip(1),
        map(() => this.result()?.id),
        filter((id) => id !== undefined),
        switchMap((id) => this.predictions.getById(id)),
        takeUntilDestroyed(),
      )
      .subscribe((prediction) => this.result.set(prediction));
  }

  scrollIntoView(): void {
    this.element.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  protected predict(): void {
    const file = this.file();

    if (!file) {
      return;
    }

    this.analyzing.set(true);
    this.predictions
      .create(file)
      .pipe(
        finalize(() => this.analyzing.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (prediction) => {
          this.result.set(prediction);
          this.predicted.emit(prediction);
        },
        error: () => undefined,
      });
  }

  protected reset(): void {
    this.result.set(null);
    this.file.set(null);
    this.scrollIntoView();
  }
}

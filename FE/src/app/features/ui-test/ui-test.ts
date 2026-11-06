import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { NotificationService } from '../../core/notifications/notification.service';
import type { FileRejection } from '../../interfaces/shared/file-rejection';
import type { SelectOption } from '../../interfaces/shared/select-option';
import { DateInput } from '../../shared/ui/date-input/date-input';
import { Dialog } from '../../shared/ui/dialog/dialog';
import { DinoLoader } from '../../shared/ui/dino-loader/dino-loader';
import { EmptyState } from '../../shared/ui/empty-state/empty-state';
import { FileDrop } from '../../shared/ui/file-drop/file-drop';
import { Icon, ICON_NAMES } from '../../shared/ui/icon/icon';
import { Paginator } from '../../shared/ui/paginator/paginator';
import { Select } from '../../shared/ui/select/select';

@Component({
  selector: 'app-ui-test',
  imports: [DateInput, Dialog, DinoLoader, EmptyState, FileDrop, Icon, Paginator, RouterLink, Select],
  templateUrl: './ui-test.html',
  styleUrl: './ui-test.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTest {
  private readonly http = inject(HttpClient);

  protected readonly notifications = inject(NotificationService);
  protected readonly icons = ICON_NAMES;
  protected readonly colors = [
    'bg',
    'surface',
    'border',
    'border-strong',
    'track',
    'text',
    'text-muted',
    'accent',
    'accent-strong',
    'accent-tint',
    'info',
    'info-tint',
    'info-bar',
    'success',
    'success-tint',
    'success-bar',
    'warning',
    'warning-tint',
    'warning-bar',
    'danger',
    'danger-tint',
    'danger-bar',
  ];
  protected readonly species: SelectOption<string | null>[] = [
    { value: null, label: 'All species' },
    { value: 'tyrannosaurus', label: 'Tyrannosaurus' },
    { value: 'triceratops', label: 'Triceratops' },
    { value: 'allosaurus', label: 'Allosaurus' },
    { value: 'stegosaurus', label: 'Stegosaurus' },
    { value: 'velociraptor', label: 'Velociraptor' },
    { value: 'brachiosaurus', label: 'Brachiosaurus' },
    { value: 'ankylosaurus', label: 'Ankylosaurus' },
    { value: 'spinosaurus', label: 'Spinosaurus' },
  ];

  protected readonly selectedSpecies = signal<string | null>(null);
  protected readonly selectedDate = signal<string | null>(null);
  protected readonly dialogOpen = signal(false);
  protected readonly page = signal(5);
  protected readonly file = signal<File | null>(null);
  protected readonly rejection = signal<FileRejection | null>(null);
  protected readonly fileResult = computed(() => this.file()?.name ?? 'No file selected.');
  protected readonly apiLoading = signal(false);
  protected readonly apiResult = signal('No request sent yet.');

  protected requestApi(): void {
    this.apiLoading.set(true);
    this.http
      .get<unknown[]>('predictions')
      .pipe(finalize(() => this.apiLoading.set(false)))
      .subscribe({
        next: (items) => this.apiResult.set(`Received ${items.length} records.`),
        error: () => this.apiResult.set('The request failed.'),
      });
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';

import type { FileRejection } from '../../../interfaces/shared/file-rejection';
import { Icon } from '../icon/icon';

const BYTES_IN_KILOBYTE = 1024;
const BYTES_IN_MEGABYTE = 1024 * BYTES_IN_KILOBYTE;

let nextId = 0;

@Component({
  selector: 'app-file-drop',
  imports: [Icon],
  templateUrl: './file-drop.html',
  styleUrl: './file-drop.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileDrop {
  readonly file = model<File | null>(null);
  readonly accept = input<readonly string[]>(['image/jpeg', 'image/png', 'image/webp']);
  readonly maxSizeBytes = input(10 * BYTES_IN_MEGABYTE);
  readonly disabled = input(false);

  readonly fileRejected = output<FileRejection>();

  private readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');

  protected readonly id = `file-drop-${nextId++}`;
  protected readonly dragging = signal(false);
  protected readonly rejection = signal<FileRejection | null>(null);
  protected readonly previewUrl = signal<string | null>(null);
  protected readonly acceptAttribute = computed(() => this.accept().join(','));
  protected readonly maxSizeMegabytes = computed(() => Math.round(this.maxSizeBytes() / BYTES_IN_MEGABYTE));
  protected readonly formats = computed(() =>
    this.accept()
      .map((type) => type.replace('image/', '').toUpperCase())
      .join(', '),
  );
  protected readonly fileSize = computed(() => {
    const size = this.file()?.size ?? 0;

    return size < BYTES_IN_MEGABYTE
      ? `${Math.round(size / BYTES_IN_KILOBYTE)} KB`
      : `${(size / BYTES_IN_MEGABYTE).toFixed(1)} MB`;
  });

  constructor() {
    effect((onCleanup) => {
      const file = this.file();

      if (!file) {
        this.previewUrl.set(null);
        return;
      }

      const url = URL.createObjectURL(file);

      this.previewUrl.set(url);
      onCleanup(() => URL.revokeObjectURL(url));
    });
  }

  protected browse(): void {
    this.input().nativeElement.click();
  }

  protected remove(): void {
    this.file.set(null);
    this.rejection.set(null);
    this.input().nativeElement.focus();
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();

    if (!this.disabled()) {
      this.dragging.set(true);
    }
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);

    const file = event.dataTransfer?.files[0];

    if (file && !this.disabled()) {
      this.select(file);
    }
  }

  protected onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.select(file);
    }

    input.value = '';
  }

  private select(file: File): void {
    const rejection = this.validate(file);

    this.rejection.set(rejection);

    if (rejection) {
      this.fileRejected.emit(rejection);
    } else {
      this.file.set(file);
    }
  }

  private validate(file: File): FileRejection | null {
    if (!this.accept().includes(file.type)) {
      return 'type';
    }

    return file.size > this.maxSizeBytes() ? 'size' : null;
  }
}

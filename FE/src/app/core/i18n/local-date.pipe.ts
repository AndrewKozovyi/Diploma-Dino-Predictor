import { inject, Pipe, PipeTransform } from '@angular/core';

import { LocalFormatService } from './local-format.service';

@Pipe({ name: 'localDate', pure: false })
export class LocalDatePipe implements PipeTransform {
  private readonly format = inject(LocalFormatService);

  transform(value: string): string {
    return this.format.date(value);
  }
}

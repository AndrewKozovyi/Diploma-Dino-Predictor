import { inject, Pipe, PipeTransform } from '@angular/core';

import { LocalFormatService } from './local-format.service';

@Pipe({ name: 'localPercent', pure: false })
export class LocalPercentPipe implements PipeTransform {
  private readonly format = inject(LocalFormatService);

  transform(value: number): string {
    return this.format.percent(value);
  }
}

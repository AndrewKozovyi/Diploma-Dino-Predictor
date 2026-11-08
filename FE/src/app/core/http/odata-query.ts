import { HttpParams } from '@angular/common/http';

export type ODataOperator = 'eq' | 'gt' | 'ge' | 'lt' | 'le';
export type ODataValue = string | number | boolean | Date;

const formatValue = (value: ODataValue): string => {
  if (typeof value === 'string') {
    return `'${value.replaceAll("'", "''")}'`;
  }

  return value instanceof Date ? value.toISOString() : String(value);
};

export class ODataQuery {
  private params = new HttpParams();
  private readonly filters: string[] = [];

  top(count?: number): this {
    return this.set('$top', count);
  }

  skip(count?: number): this {
    return this.set('$skip', count);
  }

  filter(field: string, operator: ODataOperator, value?: ODataValue): this {
    if (value !== undefined && value !== '') {
      this.filters.push(`${field} ${operator} ${formatValue(value)}`);
    }

    return this;
  }

  toParams(): HttpParams {
    return this.filters.length > 0 ? this.params.set('$filter', this.filters.join(' and ')) : this.params;
  }

  private set(option: string, count?: number): this {
    if (count !== undefined) {
      this.params = this.params.set(option, count);
    }

    return this;
  }
}

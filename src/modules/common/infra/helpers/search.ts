import { SelectQueryBuilder } from 'typeorm';
import {
  Filter,
  ISearch,
  EntityField,
  Sort,
  SearchParams,
} from '../../helpers/search';
import { PaginatedResponse } from '../../helpers/paginated';

class Search<E extends object> implements ISearch<E> {
  constructor(private query: SelectQueryBuilder<E>) {}

  private applyFilters(filter: Filter<E>): void {
    const entries = Object.entries(filter);

    const sql = entries
      .map(([field, value]) => `${this.query.alias}.${field} = '${value}'`)
      .join(' AND ');

    this.query.andWhere(`(${sql})`);
  }

  private applySearch(
    search: string,
    searchableFields: EntityField<E>[]
  ): void {
    const sql = searchableFields
      .map((field) => `${field} ILIKE '%${search}%'`)
      .join(' OR ');

    this.query.andWhere(`(${sql})`);
  }

  private applySort(sort: Sort<E>): void {
    Object.entries(sort).forEach(([field, order]) => {
      this.query.addOrderBy(field, order as 'ASC' | 'DESC');
    });
  }

  private normalizeSort(sort: string[]): Sort<E> {
    const normalized = sort.reduce((accumulator, current) => {
      const [field, value] = current.split(',');
      return { ...accumulator, [field]: value.toUpperCase() };
    }, {});
    return normalized;
  }

  private normalizeFilters(filters: string[]): Filter<E> {
    const normalized = filters.reduce((accumulator, current) => {
      const [field, value] = current.split(',');
      return { ...accumulator, [field]: value };
    }, {});
    return normalized;
  }

  async execute(params: SearchParams<E>): Promise<PaginatedResponse<E>> {
    if (params.search && params.searchableFields) {
      this.applySearch(params.search, params.searchableFields);
    }

    if (params.sort) {
      this.applySort(this.normalizeSort(params.sort));
    }

    if (params.filters) {
      this.applyFilters(this.normalizeFilters(params.filters));
    }

    const ignoreItemsLength = (params.page - 1) * params.limit;

    const [data, total] = await this.query
      .skip(ignoreItemsLength)
      .take(params.limit)
      .getManyAndCount();

    const pages = Math.ceil(total / params.limit);

    return { data, pages, total };
  }
}

export { Search };

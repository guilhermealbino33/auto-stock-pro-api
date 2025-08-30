import { PaginatedParams, PaginatedResponse } from './paginated';

type Filter<Entity> = Partial<Entity>;
type Sort<Entity> = Partial<Record<keyof Entity, 'ASC' | 'DESC'>>;

type EntityField<Entity> = Extract<keyof Entity, string>;

interface SearchParams<E> extends PaginatedParams {
  searchableFields: EntityField<E>[];
}

interface ISearch<E> {
  execute(params: SearchParams<E>): Promise<PaginatedResponse<E>>;
}

export { EntityField, Filter, ISearch, SearchParams, Sort };

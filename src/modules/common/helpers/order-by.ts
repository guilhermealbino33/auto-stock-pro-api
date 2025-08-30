import { FindOptionsOrder } from 'typeorm';

type Direction = 'asc' | 'desc';

export const parseOrderBy = <T extends object>(
  orderByString?: string
): FindOptionsOrder<T> => {
  const defaultField = 'createdAt' as keyof T;
  const defaultDirection: Direction = 'desc';

  if (!orderByString) {
    return { [defaultField]: defaultDirection } as FindOptionsOrder<T>;
  }

  const [field, direction = ''] = orderByString.split('_');
  const normalizedField = (field || defaultField) as keyof T;
  const normalizedDirection = (direction.toLowerCase() || defaultDirection) as
    | 'asc'
    | 'desc';

  return { [normalizedField]: normalizedDirection } as FindOptionsOrder<T>;
};

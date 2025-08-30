export type PaginatedParams = {
  page: number;
  limit: number;
  search?: string;
  sort?: string[];
  filters?: string[];
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  pages: number;
};

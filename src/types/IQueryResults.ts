export default interface IQueryResult<T> {
  docs: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalDocs: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

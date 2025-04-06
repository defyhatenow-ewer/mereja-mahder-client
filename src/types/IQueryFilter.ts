import { Where } from "./common.types";

export default interface IQueryFilter {
  query?: {
    where?: Where;
    select?: Where;
    populate?: Where;
  };
  options?: {
    sort?: string;
    depth?: number;
    limit?: number;
    page?: number;
  };
}

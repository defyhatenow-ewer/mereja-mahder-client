import { Where } from "./common.types";

export default interface IQueryFilter {
  where?: Where;
  sort?: string;
  select?: Where;
  populate?: { [x: string]: Where };
  depth?: number;
  limit?: number;
  page?: number;
}

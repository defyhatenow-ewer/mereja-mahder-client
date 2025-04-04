import * as qs from "qs-esm";
import { FilterItems, SortField, Where } from "../types/common.types";
import { IQueryFilter } from "../types";

export const customStringify = (filter: IQueryFilter): string =>
  qs.stringify(filter);

export const stringifyQuery = (query: Where): string =>
  qs.stringify({
    query, // ensure that `qs-esm` adds the `where` property, too!
  });

export const createFilter = (item: FilterItems, operator?: string): Where => ({
  [item.label]: {
    [operator ?? "equals"]: item.value,
  },
});

export const createSingleFilter = (
  item: FilterItems,
  operator?: string
): string => stringifyQuery(createFilter(item, operator));

export const createAndFilter = (filters: FilterItems[]): string =>
  stringifyQuery({
    and: filters.map((filter) => createFilter(filter)),
  });

export const createOrFilter = (filters: FilterItems[]): string =>
  stringifyQuery({
    or: filters.map((filter) => createFilter(filter)),
  });

export const createSort = (fields: SortField[]): string =>
  fields
    .map((field) => (field.ascending ? field.title : `-${field.title}`))
    .join(",");

export const createSelect = (fields: string[]): Where => {
  const select: Where = {};
  fields.forEach((field) => (select[field] = true));
  return select;
};

export const createPopulate = (
  collection: string,
  fields: string[]
): { [x: string]: Where } => {
  const populate: Where = {};
  fields.forEach((field) => (populate[field] = true));
  return { [collection]: populate };
};

type DocWithTitle = {
  id: string;
  title: string;
};

export const pickIdUsingTitle = (value: string, arr?: DocWithTitle[]) => {
  const obj = (arr ?? []).find((obj) => obj.title === value);
  if (obj) {
    return obj["id"];
  }
  return undefined;
};

export const pickTitleUsingID = (id: string, arr?: DocWithTitle[]) => {
  const obj = (arr ?? []).find((obj) => obj.id === id);
  if (obj) {
    return obj["title"];
  }
  return undefined;
};

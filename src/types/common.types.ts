export interface IUpdateResult<T> {
  doc: T;
  message: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export declare const validOperators: readonly [
  "equals",
  "contains",
  "not_equals",
  "in",
  "all",
  "not_in",
  "exists",
  "greater_than",
  "greater_than_equal",
  "less_than",
  "less_than_equal",
  "like",
  "not_like",
  "within",
  "intersects",
  "near",
];
export type Operator = (typeof validOperators)[number];
export declare const validOperatorSet: Set<
  | "all"
  | "contains"
  | "equals"
  | "exists"
  | "intersects"
  | "near"
  | "within"
  | "not_equals"
  | "in"
  | "not_in"
  | "greater_than"
  | "greater_than_equal"
  | "less_than"
  | "less_than_equal"
  | "like"
  | "not_like"
>;

export type JsonValue = JsonArray | JsonObject | unknown;
export type JsonArray = Array<JsonValue>;
export interface JsonObject {
  [key: string]: unknown;
}
export type WhereField = {
  [key in Operator]?: JsonValue;
};
export type Where = {
  [key: string]: Where | Where[] | WhereField | boolean | string;
} & {
  and?: Where[];
  or?: Where[];
};

export type FilterItems = {
  label: string;
  value?: string | number | boolean;
};

export type SortField = {
  title: string;
  ascending: boolean;
};

export type RichTextChild = {
  children: RichTextChild[];
  direction: string;
  format: string;
  indent: number;
  tag: string;
  type: string;
  version: number;
};

export type RichText = {
  root: RichTextChild;
};

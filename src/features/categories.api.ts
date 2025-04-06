import * as qs from "qs-esm";
import api from "../app/api";
import { IQueryFilter, IQueryResults } from "../types";
import { IUpdateResult } from "../types/common.types";
import { ICategory } from "../types/categories.types";

const apiWithCategoryTags = api.enhanceEndpoints({
  addTagTypes: ["Category"],
});

const categoryApi = apiWithCategoryTags.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation<
      ICategory,
      Omit<ICategory, "id" | "slug" | "slugLock" | "relatedPosts">
    >({
      query: (body) => ({
        url: "categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),
    getCategories: builder.query<IQueryResults<ICategory>, IQueryFilter>({
      query: (params) => {
        const filters = qs.stringify(params.query, { addQueryPrefix: true });
        return {
          url: `categories${filters}`,
          method: "GET",
          params: params.options,
        };
      },
      providesTags: (data) =>
        data && data.docs
          ? [
              ...data.docs.map(({ id }) => ({
                type: "Category" as const,
                id,
              })),
              { type: "Category", id: "PARTIAL-CATEGORY-LIST" },
            ]
          : [{ type: "Category", id: "PARTIAL-CATEGORY-LIST" }],
    }),
    getSingleCategory: builder.query<ICategory, Pick<ICategory, "id">>({
      query: ({ id }) => ({
        url: `categories/${id}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result ? [{ type: "Category", id: result.id }] : ["Category"],
    }),
    updateCategory: builder.mutation<
      IUpdateResult<ICategory>,
      {
        id: ICategory["id"];
        body: Partial<
          Omit<ICategory, "id" | "slug" | "slugLock" | "relatedPosts">
        >;
      }
    >({
      query: ({ id, body }) => ({
        url: `categories/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Category", id: arg.id },
        { type: "Category", id: "PARTIAL-CATEGORY-LIST" },
      ],
    }),
    deleteCategory: builder.mutation<ICategory, Pick<ICategory, "id">>({
      query: ({ id }) => ({
        url: `categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Category", id: arg.id },
        { type: "Category", id: "PARTIAL-CATEGORY-LIST" },
      ],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useGetSingleCategoryQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
export default categoryApi;

import * as qs from "qs-esm";
import api from "../app/api";
import { IQueryFilter, IQueryResults } from "../types";
import { IUpdateResult } from "../types/common.types";
import { ITag } from "../types/tags.types";

const apiWithTagTags = api.enhanceEndpoints({
  addTagTypes: ["Tag"],
});

const tagApi = apiWithTagTags.injectEndpoints({
  endpoints: (builder) => ({
    createTag: builder.mutation<
      ITag,
      Omit<ITag, "id" | "slug" | "slugLock" | "relatedPosts">
    >({
      query: (body) => ({
        url: "tags",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tag"],
    }),
    getTags: builder.query<IQueryResults<ITag>, IQueryFilter>({
      query: (params) => {
        const filters = qs.stringify(
          { where: params.where, select: params.select },
          { addQueryPrefix: true }
        );
        delete params.where;
        delete params.select;
        return {
          url: `tags${filters}`,
          method: "GET",
          params,
        };
      },
      providesTags: (data) =>
        data && data.docs
          ? [
              ...data.docs.map(({ id }) => ({
                type: "Tag" as const,
                id,
              })),
              { type: "Tag", id: "PARTIAL-TAG-LIST" },
            ]
          : [{ type: "Tag", id: "PARTIAL-TAG-LIST" }],
    }),
    getSingleTag: builder.query<ITag, Pick<ITag, "id">>({
      query: ({ id }) => ({
        url: `tags/${id}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result ? [{ type: "Tag", id: result.id }] : ["Tag"],
    }),
    updateTag: builder.mutation<
      IUpdateResult<ITag>,
      {
        id: ITag["id"];
        body: Partial<Omit<ITag, "id" | "slug" | "slugLock" | "relatedPosts">>;
      }
    >({
      query: ({ id, body }) => ({
        url: `tags/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Tag", id: arg.id },
        { type: "Tag", id: "PARTIAL-TAG-LIST" },
      ],
    }),
    deleteTag: builder.mutation<ITag, Pick<ITag, "id">>({
      query: ({ id }) => ({
        url: `tags/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Tag", id: arg.id },
        { type: "Tag", id: "PARTIAL-TAG-LIST" },
      ],
    }),
  }),
});

export const {
  useCreateTagMutation,
  useGetTagsQuery,
  useGetSingleTagQuery,
  useUpdateTagMutation,
  useDeleteTagMutation,
} = tagApi;
export default tagApi;

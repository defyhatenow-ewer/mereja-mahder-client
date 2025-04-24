import * as qs from "qs-esm";
import api from "../app/api";
import { IQueryFilter, IQueryResults } from "../types";
import { IUpdateResult } from "../types/common.types";
import { IForum } from "../types/forums.types";

const apiWithForumTags = api.enhanceEndpoints({
  addTagTypes: ["Forum"],
});

const forumApi = apiWithForumTags.injectEndpoints({
  endpoints: (builder) => ({
    createForum: builder.mutation<
      IForum,
      Omit<IForum, "id" | "slug" | "slugLock" | "messages">
    >({
      query: (body) => ({
        url: "forums",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Forum"],
    }),
    getForums: builder.query<IQueryResults<IForum>, IQueryFilter>({
      query: (params) => {
        const filters = qs.stringify(params.query, { addQueryPrefix: true });
        return {
          url: `forums${filters}`,
          method: "GET",
          params: params.options,
        };
      },
      providesTags: (data) =>
        data && data.docs
          ? [
              ...data.docs.map(({ id }) => ({
                type: "Forum" as const,
                id,
              })),
              { type: "Forum", id: "PARTIAL-FORUM-LIST" },
            ]
          : [{ type: "Forum", id: "PARTIAL-FORUM-LIST" }],
    }),
    getSingleForum: builder.query<IForum, Pick<IForum, "id">>({
      query: ({ id }) => ({
        url: `forums/${id}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result ? [{ type: "Forum", id: result.id }] : ["Forum"],
    }),
    updateForum: builder.mutation<
      IUpdateResult<IForum>,
      {
        id: IForum["id"];
        body: Partial<Omit<IForum, "id" | "slug" | "slugLock" | "messages">>;
      }
    >({
      query: ({ id, body }) => ({
        url: `forums/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Forum", id: arg.id },
        { type: "Forum", id: "PARTIAL-FORUM-LIST" },
      ],
    }),
    deleteForum: builder.mutation<IForum, Pick<IForum, "id">>({
      query: ({ id }) => ({
        url: `forums/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Forum", id: arg.id },
        { type: "Forum", id: "PARTIAL-FORUM-LIST" },
      ],
    }),
  }),
});

export const {
  useCreateForumMutation,
  useGetForumsQuery,
  useGetSingleForumQuery,
  useUpdateForumMutation,
  useDeleteForumMutation,
} = forumApi;
export default forumApi;

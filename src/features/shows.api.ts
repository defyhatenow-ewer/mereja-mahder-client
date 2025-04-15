import * as qs from "qs-esm";
import api from "../app/api";
import { IQueryFilter, IQueryResults } from "../types";
import { IUpdateResult } from "../types/common.types";
import { IShow } from "../types/posts.types";

const apiWithShowTags = api.enhanceEndpoints({
  addTagTypes: ["Show"],
});

const showApi = apiWithShowTags.injectEndpoints({
  endpoints: (builder) => ({
    createShow: builder.mutation<
      IShow,
      Omit<
        IShow,
        | "id"
        | "_status"
        | "slug"
        | "slugLock"
        | "relatedShows"
        | "populatedAuthors"
      >
    >({
      query: (body) => ({
        url: "shows",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Show"],
    }),
    getShows: builder.query<IQueryResults<IShow>, IQueryFilter>({
      query: (params) => {
        const filters = qs.stringify(params.query, { addQueryPrefix: true });
        return {
          url: `shows${filters}`,
          method: "GET",
          params: params.options,
        };
      },
      providesTags: (data) =>
        data && data.docs
          ? [
              ...data.docs.map(({ id }) => ({
                type: "Show" as const,
                id,
              })),
              { type: "Show", id: "PARTIAL-SHOW-LIST" },
            ]
          : [{ type: "Show", id: "PARTIAL-SHOW-LIST" }],
    }),
    getSingleShow: builder.query<IShow, Pick<IShow, "id">>({
      query: ({ id }) => ({
        url: `shows/${id}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result ? [{ type: "Show", id: result.id }] : ["Show"],
    }),
    updateShow: builder.mutation<
      IUpdateResult<IShow>,
      {
        id: IShow["id"];
        body: Partial<
          Omit<
            IShow,
            | "id"
            | "_status"
            | "slug"
            | "slugLock"
            | "relatedShows"
            | "populatedAuthors"
          >
        >;
      }
    >({
      query: ({ id, body }) => ({
        url: `shows/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Show", id: arg.id },
        { type: "Show", id: "PARTIAL-SHOW-LIST" },
      ],
    }),
    deleteShow: builder.mutation<IShow, Pick<IShow, "id">>({
      query: ({ id }) => ({
        url: `shows/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Show", id: arg.id },
        { type: "Show", id: "PARTIAL-SHOW-LIST" },
      ],
    }),
  }),
});

export const {
  useCreateShowMutation,
  useGetShowsQuery,
  useGetSingleShowQuery,
  useUpdateShowMutation,
  useDeleteShowMutation,
} = showApi;
export default showApi;

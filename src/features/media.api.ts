import * as qs from "qs-esm";
import api from "../app/api";
import { IQueryFilter, IQueryResults } from "../types";
import { IUpdateResult } from "../types/common.types";
import { IMedia } from "../types/media.types";

const apiWithMediaTags = api.enhanceEndpoints({
  addTagTypes: ["Media"],
});

const mediaApi = apiWithMediaTags.injectEndpoints({
  endpoints: (builder) => ({
    createMedia: builder.mutation<
      IMedia,
      Pick<IMedia, "alt" | "caption" | "url" | "filename">
    >({
      query: (body) => ({
        url: "media",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Media"],
    }),
    getMedias: builder.query<IQueryResults<IMedia>, IQueryFilter>({
      query: (params) => {
        const filters = qs.stringify(params.query, { addQueryPrefix: true });
        return {
          url: `media${filters}`,
          method: "GET",
          params: {
            sort: "-publishedAt",
            ...params.options,
          },
        };
      },
      providesTags: (data) =>
        data && data.docs
          ? [
              ...data.docs.map(({ id }) => ({
                type: "Media" as const,
                id,
              })),
              { type: "Media", id: "PARTIAL-MEDIA-LIST" },
            ]
          : [{ type: "Media", id: "PARTIAL-MEDIA-LIST" }],
    }),
    getSingleMedia: builder.query<IMedia, Pick<IMedia, "id">>({
      query: ({ id }) => ({
        url: `media/${id}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result ? [{ type: "Media", id: result.id }] : ["Media"],
    }),
    updateMedia: builder.mutation<
      IUpdateResult<IMedia>,
      {
        id: IMedia["id"];
        body: Partial<Pick<IMedia, "alt" | "caption" | "url" | "filename">>;
      }
    >({
      query: ({ id, body }) => ({
        url: `media/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Media", id: arg.id },
        { type: "Media", id: "PARTIAL-MEDIA-LIST" },
      ],
    }),
    deleteMedia: builder.mutation<IMedia, Pick<IMedia, "id">>({
      query: ({ id }) => ({
        url: `media/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Media", id: arg.id },
        { type: "Media", id: "PARTIAL-MEDIA-LIST" },
      ],
    }),
  }),
});

export const {
  useCreateMediaMutation,
  useGetMediasQuery,
  useGetSingleMediaQuery,
  useUpdateMediaMutation,
  useDeleteMediaMutation,
} = mediaApi;
export default mediaApi;

import * as qs from "qs-esm";
import api from "../app/api";
import { IQueryFilter, IQueryResults } from "../types";
import { IUpdateResult } from "../types/common.types";
import { ISafetyResource } from "../types/posts.types";

const apiWithSafetyResourceTags = api.enhanceEndpoints({
  addTagTypes: ["SafetyResource"],
});

const safetyResourceApi = apiWithSafetyResourceTags.injectEndpoints({
  endpoints: (builder) => ({
    createSafetyResource: builder.mutation<
      ISafetyResource,
      Omit<
        ISafetyResource,
        | "id"
        | "_status"
        | "slug"
        | "slugLock"
        | "relatedSafetyResources"
        | "populatedAuthors"
      >
    >({
      query: (body) => ({
        url: "safety-resources",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SafetyResource"],
    }),
    getSafetyResources: builder.query<
      IQueryResults<ISafetyResource>,
      IQueryFilter
    >({
      query: (params) => {
        const filters = qs.stringify(params.query, { addQueryPrefix: true });
        return {
          url: `safety-resources${filters}`,
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
                type: "SafetyResource" as const,
                id,
              })),
              { type: "SafetyResource", id: "PARTIAL-SAFETY-RESOURCE-LIST" },
            ]
          : [{ type: "SafetyResource", id: "PARTIAL-SAFETY-RESOURCE-LIST" }],
    }),
    getSingleSafetyResource: builder.query<
      ISafetyResource,
      Pick<ISafetyResource, "id">
    >({
      query: ({ id }) => ({
        url: `safety-resources/${id}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [{ type: "SafetyResource", id: result.id }]
          : ["SafetyResource"],
    }),
    updateSafetyResource: builder.mutation<
      IUpdateResult<ISafetyResource>,
      {
        id: ISafetyResource["id"];
        body: Partial<
          Omit<
            ISafetyResource,
            | "id"
            | "_status"
            | "slug"
            | "slugLock"
            | "relatedSafetyResources"
            | "populatedAuthors"
          >
        >;
      }
    >({
      query: ({ id, body }) => ({
        url: `safety-resources/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "SafetyResource", id: arg.id },
        { type: "SafetyResource", id: "PARTIAL-SAFETY-RESOURCE-LIST" },
      ],
    }),
    deleteSafetyResource: builder.mutation<
      ISafetyResource,
      Pick<ISafetyResource, "id">
    >({
      query: ({ id }) => ({
        url: `safety-resources/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "SafetyResource", id: arg.id },
        { type: "SafetyResource", id: "PARTIAL-SAFETY-RESOURCE-LIST" },
      ],
    }),
  }),
});

export const {
  useCreateSafetyResourceMutation,
  useGetSafetyResourcesQuery,
  useGetSingleSafetyResourceQuery,
  useUpdateSafetyResourceMutation,
  useDeleteSafetyResourceMutation,
} = safetyResourceApi;
export default safetyResourceApi;

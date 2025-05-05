import * as qs from "qs-esm";
import api from "../app/api";
import { IQueryFilter, IQueryResults } from "../types";
import { IUpdateResult } from "../types/common.types";
import { ILearningResource } from "../types/posts.types";

const apiWithLearningResourceTags = api.enhanceEndpoints({
  addTagTypes: ["LearningResource"],
});

const learningResourceApi = apiWithLearningResourceTags.injectEndpoints({
  endpoints: (builder) => ({
    createLearningResource: builder.mutation<
      ILearningResource,
      Omit<
        ILearningResource,
        | "id"
        | "_status"
        | "slug"
        | "slugLock"
        | "relatedLearningResources"
        | "populatedAuthors"
      >
    >({
      query: (body) => ({
        url: "learning-resources",
        method: "POST",
        body,
      }),
      invalidatesTags: ["LearningResource"],
    }),
    getLearningResources: builder.query<
      IQueryResults<ILearningResource>,
      IQueryFilter
    >({
      query: (params) => {
        const filters = qs.stringify(params.query, { addQueryPrefix: true });
        return {
          url: `learning-resources${filters}`,
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
                type: "LearningResource" as const,
                id,
              })),
              {
                type: "LearningResource",
                id: "PARTIAL-LEARNING-RESOURCE-LIST",
              },
            ]
          : [
              {
                type: "LearningResource",
                id: "PARTIAL-LEARNING-RESOURCE-LIST",
              },
            ],
    }),
    getSingleLearningResource: builder.query<
      ILearningResource,
      Pick<ILearningResource, "id">
    >({
      query: ({ id }) => ({
        url: `learning-resources/${id}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [{ type: "LearningResource", id: result.id }]
          : ["LearningResource"],
    }),
    updateLearningResource: builder.mutation<
      IUpdateResult<ILearningResource>,
      {
        id: ILearningResource["id"];
        body: Partial<
          Omit<
            ILearningResource,
            | "id"
            | "_status"
            | "slug"
            | "slugLock"
            | "relatedLearningResources"
            | "populatedAuthors"
          >
        >;
      }
    >({
      query: ({ id, body }) => ({
        url: `learning-resources/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "LearningResource", id: arg.id },
        { type: "LearningResource", id: "PARTIAL-LEARNING-RESOURCE-LIST" },
      ],
    }),
    deleteLearningResource: builder.mutation<
      ILearningResource,
      Pick<ILearningResource, "id">
    >({
      query: ({ id }) => ({
        url: `learning-resources/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "LearningResource", id: arg.id },
        { type: "LearningResource", id: "PARTIAL-LEARNING-RESOURCE-LIST" },
      ],
    }),
  }),
});

export const {
  useCreateLearningResourceMutation,
  useGetLearningResourcesQuery,
  useGetSingleLearningResourceQuery,
  useUpdateLearningResourceMutation,
  useDeleteLearningResourceMutation,
} = learningResourceApi;
export default learningResourceApi;

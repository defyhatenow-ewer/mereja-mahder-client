import * as qs from "qs-esm";
import api from "../app/api";
import { IQueryFilter, IQueryResults } from "../types";
import { IUpdateResult } from "../types/common.types";
import { IResource } from "../types/posts.types";

const apiWithResourceTags = api.enhanceEndpoints({
  addTagTypes: ["Resource"],
});

const resourceApi = apiWithResourceTags.injectEndpoints({
  endpoints: (builder) => ({
    createResource: builder.mutation<
      IResource,
      Omit<
        IResource,
        | "id"
        | "_status"
        | "slug"
        | "slugLock"
        | "relatedResources"
        | "populatedAuthors"
      >
    >({
      query: (body) => ({
        url: "resources",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Resource"],
    }),
    getResources: builder.query<IQueryResults<IResource>, IQueryFilter>({
      query: (params) => {
        const filters = qs.stringify(params.query, { addQueryPrefix: true });
        return {
          url: `resources${filters}`,
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
                type: "Resource" as const,
                id,
              })),
              { type: "Resource", id: "PARTIAL-RESOURCE-LIST" },
            ]
          : [{ type: "Resource", id: "PARTIAL-RESOURCE-LIST" }],
    }),
    getSingleResource: builder.query<IResource, Pick<IResource, "id">>({
      query: ({ id }) => ({
        url: `resources/${id}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result ? [{ type: "Resource", id: result.id }] : ["Resource"],
    }),
    updateResource: builder.mutation<
      IUpdateResult<IResource>,
      {
        id: IResource["id"];
        body: Partial<
          Omit<
            IResource,
            | "id"
            | "_status"
            | "slug"
            | "slugLock"
            | "relatedResources"
            | "populatedAuthors"
          >
        >;
      }
    >({
      query: ({ id, body }) => ({
        url: `resources/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Resource", id: arg.id },
        { type: "Resource", id: "PARTIAL-RESOURCE-LIST" },
      ],
    }),
    deleteResource: builder.mutation<IResource, Pick<IResource, "id">>({
      query: ({ id }) => ({
        url: `resources/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Resource", id: arg.id },
        { type: "Resource", id: "PARTIAL-RESOURCE-LIST" },
      ],
    }),
  }),
});

export const {
  useCreateResourceMutation,
  useGetResourcesQuery,
  useGetSingleResourceQuery,
  useUpdateResourceMutation,
  useDeleteResourceMutation,
} = resourceApi;
export default resourceApi;

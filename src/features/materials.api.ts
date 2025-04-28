import * as qs from "qs-esm";
import api from "../app/api";
import { IQueryFilter, IQueryResults } from "../types";
import { IUpdateResult } from "../types/common.types";
import { IMaterial } from "../types/posts.types";

const apiWithMaterialTags = api.enhanceEndpoints({
  addTagTypes: ["Material"],
});

const materialApi = apiWithMaterialTags.injectEndpoints({
  endpoints: (builder) => ({
    createMaterial: builder.mutation<
      IMaterial,
      Omit<
        IMaterial,
        | "id"
        | "_status"
        | "slug"
        | "slugLock"
        | "relatedMaterials"
        | "populatedAuthors"
      >
    >({
      query: (body) => ({
        url: "materials",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Material"],
    }),
    getMaterials: builder.query<IQueryResults<IMaterial>, IQueryFilter>({
      query: (params) => {
        const filters = qs.stringify(params.query, { addQueryPrefix: true });
        return {
          url: `materials${filters}`,
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
                type: "Material" as const,
                id,
              })),
              { type: "Material", id: "PARTIAL-MATERIAL-LIST" },
            ]
          : [{ type: "Material", id: "PARTIAL-MATERIAL-LIST" }],
    }),
    getSingleMaterial: builder.query<IMaterial, Pick<IMaterial, "id">>({
      query: ({ id }) => ({
        url: `materials/${id}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result ? [{ type: "Material", id: result.id }] : ["Material"],
    }),
    updateMaterial: builder.mutation<
      IUpdateResult<IMaterial>,
      {
        id: IMaterial["id"];
        body: Partial<
          Omit<
            IMaterial,
            | "id"
            | "_status"
            | "slug"
            | "slugLock"
            | "relatedMaterials"
            | "populatedAuthors"
          >
        >;
      }
    >({
      query: ({ id, body }) => ({
        url: `materials/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Material", id: arg.id },
        { type: "Material", id: "PARTIAL-MATERIAL-LIST" },
      ],
    }),
    deleteMaterial: builder.mutation<IMaterial, Pick<IMaterial, "id">>({
      query: ({ id }) => ({
        url: `materials/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Material", id: arg.id },
        { type: "Material", id: "PARTIAL-MATERIAL-LIST" },
      ],
    }),
  }),
});

export const {
  useCreateMaterialMutation,
  useGetMaterialsQuery,
  useGetSingleMaterialQuery,
  useUpdateMaterialMutation,
  useDeleteMaterialMutation,
} = materialApi;
export default materialApi;

import * as qs from "qs-esm";
import api from "../app/api";
import { IQueryFilter, IQueryResults } from "../types";
import { IUpdateResult } from "../types/common.types";
import { ISpace } from "../types/space.types";

const apiWithSpaceTags = api.enhanceEndpoints({
  addTagTypes: ["Space"],
});

const spaceApi = apiWithSpaceTags.injectEndpoints({
  endpoints: (builder) => ({
    createSpace: builder.mutation<
      ISpace,
      Omit<ISpace, "id" | "slug" | "slugLock" | "users" | "posts" | "pages">
    >({
      query: (body) => ({
        url: "spaces",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Space"],
    }),
    getSpaces: builder.query<IQueryResults<ISpace>, IQueryFilter>({
      query: (params) => {
        const filters = qs.stringify(
          { where: params.where, select: params.select },
          { addQueryPrefix: true }
        );
        delete params.where;
        delete params.select;
        return {
          url: `spaces${filters}`,
          method: "GET",
          params,
        };
      },
      providesTags: (data) =>
        data && data.docs
          ? [
              ...data.docs.map(({ id }) => ({
                type: "Space" as const,
                id,
              })),
              { type: "Space", id: "PARTIAL-SPACE-LIST" },
            ]
          : [{ type: "Space", id: "PARTIAL-SPACE-LIST" }],
    }),
    getSingleSpace: builder.query<ISpace, Pick<ISpace, "id">>({
      query: ({ id }) => ({
        url: `spaces/${id}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result ? [{ type: "Space", id: result.id }] : ["Space"],
    }),
    updateSpace: builder.mutation<
      IUpdateResult<ISpace>,
      {
        id: ISpace["id"];
        body: Partial<
          Omit<ISpace, "id" | "slug" | "slugLock" | "users" | "posts" | "pages">
        >;
      }
    >({
      query: ({ id, body }) => ({
        url: `spaces/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Space", id: arg.id },
        { type: "Space", id: "PARTIAL-SPACE-LIST" },
      ],
    }),
    deleteSpace: builder.mutation<ISpace, Pick<ISpace, "id">>({
      query: ({ id }) => ({
        url: `spaces/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Space", id: arg.id },
        { type: "Space", id: "PARTIAL-SPACE-LIST" },
      ],
    }),
  }),
});

export const {
  useCreateSpaceMutation,
  useGetSpacesQuery,
  useGetSingleSpaceQuery,
  useUpdateSpaceMutation,
  useDeleteSpaceMutation,
} = spaceApi;
export default spaceApi;

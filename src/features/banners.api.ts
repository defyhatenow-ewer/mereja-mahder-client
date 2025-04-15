import * as qs from "qs-esm";
import api from "../app/api";
import { IQueryFilter, IQueryResults } from "../types";
import { IUpdateResult } from "../types/common.types";
import { IBanner } from "../types/posts.types";

const apiWithBannerTags = api.enhanceEndpoints({
  addTagTypes: ["Banner"],
});

const bannerApi = apiWithBannerTags.injectEndpoints({
  endpoints: (builder) => ({
    createBanner: builder.mutation<
      IBanner,
      Omit<IBanner, "id" | "slug" | "slugLock">
    >({
      query: (body) => ({
        url: "banners",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Banner"],
    }),
    getBanners: builder.query<IQueryResults<IBanner>, IQueryFilter>({
      query: (params) => {
        const filters = qs.stringify(params.query, { addQueryPrefix: true });
        return {
          url: `banners${filters}`,
          method: "GET",
          params: params.options,
        };
      },
      providesTags: (data) =>
        data && data.docs
          ? [
              ...data.docs.map(({ id }) => ({
                type: "Banner" as const,
                id,
              })),
              { type: "Banner", id: "PARTIAL-BANNER-LIST" },
            ]
          : [{ type: "Banner", id: "PARTIAL-BANNER-LIST" }],
    }),
    getSingleBanner: builder.query<IBanner, Pick<IBanner, "id">>({
      query: ({ id }) => ({
        url: `banners/${id}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result ? [{ type: "Banner", id: result.id }] : ["Banner"],
    }),
    updateBanner: builder.mutation<
      IUpdateResult<IBanner>,
      {
        id: IBanner["id"];
        body: Partial<Omit<IBanner, "id" | "slug" | "slugLock">>;
      }
    >({
      query: ({ id, body }) => ({
        url: `banners/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Banner", id: arg.id },
        { type: "Banner", id: "PARTIAL-BANNER-LIST" },
      ],
    }),
    deleteBanner: builder.mutation<IBanner, Pick<IBanner, "id">>({
      query: ({ id }) => ({
        url: `banners/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Banner", id: arg.id },
        { type: "Banner", id: "PARTIAL-BANNER-LIST" },
      ],
    }),
  }),
});

export const {
  useCreateBannerMutation,
  useGetBannersQuery,
  useGetSingleBannerQuery,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannerApi;
export default bannerApi;

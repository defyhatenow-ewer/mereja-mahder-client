import * as qs from "qs-esm";
import api from "../app/api";
import { IQueryFilter, IQueryResults } from "../types";
import { IUpdateResult } from "../types/common.types";
import { IChart } from "../types/posts.types";

const apiWithChartTags = api.enhanceEndpoints({
  addTagTypes: ["Chart"],
});

const chartApi = apiWithChartTags.injectEndpoints({
  endpoints: (builder) => ({
    createChart: builder.mutation<
      IChart,
      Omit<
        IChart,
        | "id"
        | "_status"
        | "slug"
        | "slugLock"
        | "relatedCharts"
        | "populatedAuthors"
      >
    >({
      query: (body) => ({
        url: "charts",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Chart"],
    }),
    getCharts: builder.query<IQueryResults<IChart>, IQueryFilter>({
      query: (params) => {
        const filters = qs.stringify(params.query, { addQueryPrefix: true });
        return {
          url: `charts${filters}`,
          method: "GET",
          params: params.options,
        };
      },
      providesTags: (data) =>
        data && data.docs
          ? [
              ...data.docs.map(({ id }) => ({
                type: "Chart" as const,
                id,
              })),
              { type: "Chart", id: "PARTIAL-CHART-LIST" },
            ]
          : [{ type: "Chart", id: "PARTIAL-CHART-LIST" }],
    }),
    getSingleChart: builder.query<IChart, Pick<IChart, "id">>({
      query: ({ id }) => ({
        url: `charts/${id}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result ? [{ type: "Chart", id: result.id }] : ["Chart"],
    }),
    updateChart: builder.mutation<
      IUpdateResult<IChart>,
      {
        id: IChart["id"];
        body: Partial<
          Omit<
            IChart,
            | "id"
            | "_status"
            | "slug"
            | "slugLock"
            | "relatedCharts"
            | "populatedAuthors"
          >
        >;
      }
    >({
      query: ({ id, body }) => ({
        url: `charts/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Chart", id: arg.id },
        { type: "Chart", id: "PARTIAL-CHART-LIST" },
      ],
    }),
    deleteChart: builder.mutation<IChart, Pick<IChart, "id">>({
      query: ({ id }) => ({
        url: `charts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Chart", id: arg.id },
        { type: "Chart", id: "PARTIAL-CHART-LIST" },
      ],
    }),
  }),
});

export const {
  useCreateChartMutation,
  useGetChartsQuery,
  useGetSingleChartQuery,
  useUpdateChartMutation,
  useDeleteChartMutation,
} = chartApi;
export default chartApi;

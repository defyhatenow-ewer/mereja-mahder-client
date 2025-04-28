import * as qs from "qs-esm";
import api from "../app/api";
import { IQueryFilter, IQueryResults } from "../types";
import { IUpdateResult } from "../types/common.types";
import { IReport } from "../types/posts.types";

const apiWithReportTags = api.enhanceEndpoints({
  addTagTypes: ["Report"],
});

const reportApi = apiWithReportTags.injectEndpoints({
  endpoints: (builder) => ({
    createReport: builder.mutation<
      IReport,
      Omit<
        IReport,
        | "id"
        | "_status"
        | "slug"
        | "slugLock"
        | "relatedReports"
        | "populatedAuthors"
      >
    >({
      query: (body) => ({
        url: "reports",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Report"],
    }),
    getReports: builder.query<IQueryResults<IReport>, IQueryFilter>({
      query: (params) => {
        const filters = qs.stringify(params.query, { addQueryPrefix: true });
        return {
          url: `reports${filters}`,
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
                type: "Report" as const,
                id,
              })),
              { type: "Report", id: "PARTIAL-REPORT-LIST" },
            ]
          : [{ type: "Report", id: "PARTIAL-REPORT-LIST" }],
    }),
    getSingleReport: builder.query<IReport, Pick<IReport, "id">>({
      query: ({ id }) => ({
        url: `reports/${id}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result ? [{ type: "Report", id: result.id }] : ["Report"],
    }),
    updateReport: builder.mutation<
      IUpdateResult<IReport>,
      {
        id: IReport["id"];
        body: Partial<
          Omit<
            IReport,
            | "id"
            | "_status"
            | "slug"
            | "slugLock"
            | "relatedReports"
            | "populatedAuthors"
          >
        >;
      }
    >({
      query: ({ id, body }) => ({
        url: `reports/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Report", id: arg.id },
        { type: "Report", id: "PARTIAL-REPORT-LIST" },
      ],
    }),
    deleteReport: builder.mutation<IReport, Pick<IReport, "id">>({
      query: ({ id }) => ({
        url: `reports/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Report", id: arg.id },
        { type: "Report", id: "PARTIAL-REPORT-LIST" },
      ],
    }),
  }),
});

export const {
  useCreateReportMutation,
  useGetReportsQuery,
  useGetSingleReportQuery,
  useUpdateReportMutation,
  useDeleteReportMutation,
} = reportApi;
export default reportApi;

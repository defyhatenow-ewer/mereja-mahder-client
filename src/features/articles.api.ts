import * as qs from "qs-esm";
import api from "../app/api";
import { IQueryFilter, IQueryResults } from "../types";
import { IUpdateResult } from "../types/common.types";
import { IArticle } from "../types/posts.types";

const apiWithArticleTags = api.enhanceEndpoints({
  addTagTypes: ["Article"],
});

const articleApi = apiWithArticleTags.injectEndpoints({
  endpoints: (builder) => ({
    createArticle: builder.mutation<
      IArticle,
      Omit<
        IArticle,
        | "id"
        | "_status"
        | "slug"
        | "slugLock"
        | "relatedArticles"
        | "populatedAuthors"
      >
    >({
      query: (body) => ({
        url: "articles",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Article"],
    }),
    getArticles: builder.query<IQueryResults<IArticle>, IQueryFilter>({
      query: (params) => {
        const filters = qs.stringify(params.query, { addQueryPrefix: true });
        return {
          url: `articles${filters}`,
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
                type: "Article" as const,
                id,
              })),
              { type: "Article", id: "PARTIAL-ARTICLE-LIST" },
            ]
          : [{ type: "Article", id: "PARTIAL-ARTICLE-LIST" }],
    }),
    getSingleArticle: builder.query<IArticle, Pick<IArticle, "id">>({
      query: ({ id }) => ({
        url: `articles/${id}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result ? [{ type: "Article", id: result.id }] : ["Article"],
    }),
    updateArticle: builder.mutation<
      IUpdateResult<IArticle>,
      {
        id: IArticle["id"];
        body: Partial<
          Omit<
            IArticle,
            | "id"
            | "_status"
            | "slug"
            | "slugLock"
            | "relatedArticles"
            | "populatedAuthors"
          >
        >;
      }
    >({
      query: ({ id, body }) => ({
        url: `articles/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Article", id: arg.id },
        { type: "Article", id: "PARTIAL-ARTICLE-LIST" },
      ],
    }),
    deleteArticle: builder.mutation<IArticle, Pick<IArticle, "id">>({
      query: ({ id }) => ({
        url: `articles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Article", id: arg.id },
        { type: "Article", id: "PARTIAL-ARTICLE-LIST" },
      ],
    }),
  }),
});

export const {
  useCreateArticleMutation,
  useGetArticlesQuery,
  useGetSingleArticleQuery,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} = articleApi;
export default articleApi;

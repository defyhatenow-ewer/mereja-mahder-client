import * as qs from "qs-esm";
import api from "../app/api";
import { IQueryFilter, IQueryResults } from "../types";
import { IUpdateResult } from "../types/common.types";
import { IPost } from "../types/posts.types";

const apiWithPostTags = api.enhanceEndpoints({
  addTagTypes: ["Post"],
});

const postApi = apiWithPostTags.injectEndpoints({
  endpoints: (builder) => ({
    createPost: builder.mutation<
      IPost,
      Omit<
        IPost,
        | "id"
        | "_status"
        | "slug"
        | "slugLock"
        | "relatedPosts"
        | "populatedAuthors"
      >
    >({
      query: (body) => ({
        url: "posts",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Post"],
    }),
    getPosts: builder.query<IQueryResults<IPost>, IQueryFilter>({
      query: (params) => {
        const filters = qs.stringify(
          { where: params.where, select: params.select },
          { addQueryPrefix: true }
        );
        return {
          url: `posts${filters}`,
          method: "GET",
          params,
        };
      },
      providesTags: (data) =>
        data && data.docs
          ? [
              ...data.docs.map(({ id }) => ({
                type: "Post" as const,
                id,
              })),
              { type: "Post", id: "PARTIAL-POST-LIST" },
            ]
          : [{ type: "Post", id: "PARTIAL-POST-LIST" }],
    }),
    getSinglePost: builder.query<IPost, Pick<IPost, "id">>({
      query: ({ id }) => ({
        url: `posts/${id}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result ? [{ type: "Post", id: result.id }] : ["Post"],
    }),
    updatePost: builder.mutation<
      IUpdateResult<IPost>,
      {
        id: IPost["id"];
        body: Partial<
          Omit<
            IPost,
            | "id"
            | "_status"
            | "slug"
            | "slugLock"
            | "relatedPosts"
            | "populatedAuthors"
          >
        >;
      }
    >({
      query: ({ id, body }) => ({
        url: `posts/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Post", id: arg.id },
        { type: "Post", id: "PARTIAL-POST-LIST" },
      ],
    }),
    deletePost: builder.mutation<IPost, Pick<IPost, "id">>({
      query: ({ id }) => ({
        url: `posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Post", id: arg.id },
        { type: "Post", id: "PARTIAL-POST-LIST" },
      ],
    }),
  }),
});

export const {
  useCreatePostMutation,
  useGetPostsQuery,
  useGetSinglePostQuery,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postApi;
export default postApi;

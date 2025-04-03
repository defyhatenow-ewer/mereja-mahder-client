import * as qs from "qs-esm";
import api from "../app/api";
import { IQueryResults } from "../types";
import { IUpdateResult } from "../types/common.types";
import {
  ICreateUserRequest,
  IDeleteUserRequest,
  IGetSingleUserRequest,
  IGetUsersRequestParams,
  IUpdateUserRequest,
  IUserWithoutPassword,
} from "../types/users.types";

const apiWithUserTags = api.enhanceEndpoints({ addTagTypes: ["User"] });

const userApi = apiWithUserTags.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation<IUserWithoutPassword, ICreateUserRequest>({
      query: (body) => ({
        url: "users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    getUsers: builder.query<
      IQueryResults<IUserWithoutPassword>,
      IGetUsersRequestParams
    >({
      query: (params) => {
        const filters = qs.stringify(
          { where: params.where, select: params.select },
          { addQueryPrefix: true }
        );
        delete params.where;
        delete params.select;
        return {
          url: `users${filters}`,
          method: "GET",
          params,
        };
      },
      providesTags: (data) =>
        data && data.docs
          ? [
              ...data.docs.map(({ id }) => ({ type: "User" as const, id })),
              { type: "User", id: "PARTIAL-USER-LIST" },
            ]
          : [{ type: "User", id: "PARTIAL-USER-LIST" }],
    }),
    getSingleUser: builder.query<IUserWithoutPassword, IGetSingleUserRequest>({
      query: ({ id }) => ({
        url: `users/${id}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result ? [{ type: "User", id: result.id }] : ["User"],
    }),
    count: builder.query<
      Pick<IQueryResults<IUserWithoutPassword>, "totalDocs">,
      void
    >({
      query: () => ({
        url: `users/count`,
        method: "GET",
      }),
    }),
    updateUser: builder.mutation<
      IUpdateResult<IUserWithoutPassword>,
      IUpdateUserRequest
    >({
      query: ({ id, body }) => ({
        url: `users/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "User", id: arg.id },
        { type: "User", id: "PARTIAL-USER-LIST" },
      ],
    }),
    deleteUser: builder.mutation<IUserWithoutPassword, IDeleteUserRequest>({
      query: ({ id }) => ({
        url: `users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "User", id: arg.id },
        { type: "User", id: "PARTIAL-USER-LIST" },
      ],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useGetUsersQuery,
  useGetSingleUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
export default userApi;

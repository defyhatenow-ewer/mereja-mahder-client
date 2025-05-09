import api from "../app/api";
import {
  IRegisterRequest,
  IResetPasswordRequestBody,
  IUserWithRefreshToken,
  IUserWithToken,
} from "../types/auth.types";
import { IUser, IUserWithoutPassword } from "../types/users.types";

const apiWithAuthTags = api.enhanceEndpoints({ addTagTypes: ["Auth", "Me"] });

const authApi = apiWithAuthTags.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<IUserWithToken, Pick<IUser, "email" | "password">>({
      query: (body) => ({
        url: "users/login",
        method: "POST",
        credentials: "include",
        body,
      }),
      invalidatesTags: ["Auth", "Me"],
    }),
    register: builder.mutation<IUserWithoutPassword, IRegisterRequest>({
      query: (body) => ({
        url: "users/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "users/logout",
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["Auth", "Me"],
    }),
    refreshToken: builder.mutation<IUserWithRefreshToken, void>({
      query: () => ({
        url: "users/refresh-token",
        method: "POST",
        credentials: "include",
      }),
      extraOptions: { maxRetries: 0 },
      invalidatesTags: ["Auth"],
    }),
    forgotPassword: builder.mutation<
      { message: "string" },
      Pick<IUser, "email">
    >({
      query: (body) => ({
        url: "users/forgot-password",
        method: "POST",
        credentials: "include",
        body,
      }),
    }),
    resetPassword: builder.mutation<
      Omit<IUserWithToken, "exp">,
      IResetPasswordRequestBody
    >({
      query: (body) => ({
        url: "users/reset-password",
        method: "POST",
        credentials: "include",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    verifyEmail: builder.mutation<{ message: "string" }, string>({
      query: (token) => ({
        url: `users/verify/${token}`,
        credentials: "include",
        method: "POST",
      }),
    }),
    unlock: builder.mutation<{ message: "string" }, Pick<IUser, "email">>({
      query: (body) => ({
        url: "users/unlock",
        method: "POST",
        credentials: "include",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    me: builder.query<IUserWithToken, void>({
      query: () => ({
        url: "users/me",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Me"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useUnlockMutation,
  useMeQuery,
} = authApi;
export default authApi;

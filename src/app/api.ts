import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import { IUserWithRefreshToken } from "../types/auth.types";
import { config } from "../config";

const mutex = new Mutex();

export const resetAuth = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("exp");
  localStorage.removeItem("userId");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("exp");
  sessionStorage.removeItem("userId");
};

const baseQuery = fetchBaseQuery({
  baseUrl: config.apiUrl,
  prepareHeaders: (headers) => {
    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const rememberMe = localStorage.getItem("rememberMe");
        const token =
          sessionStorage.getItem("token") || localStorage.getItem("token");

        if (token) {
          // try to get a new token
          const refreshResult = await baseQuery(
            {
              url: "users/refresh-token",
              method: "GET",
              headers: {
                authorization: `Bearer ${token}`,
              },
            },
            api,
            extraOptions
          );
          if (refreshResult.data) {
            console.log({ result: refreshResult.data });
            const userWithTokens = refreshResult.data as IUserWithRefreshToken;
            if (rememberMe === "true") {
              localStorage.setItem("token", userWithTokens.refreshedToken);
              localStorage.setItem("exp", userWithTokens.exp.toString());
              localStorage.setItem("userId", userWithTokens.user.id);
            } else {
              sessionStorage.setItem("token", userWithTokens.refreshedToken);
              sessionStorage.setItem("exp", userWithTokens.exp.toString());
              sessionStorage.setItem("userId", userWithTokens.user.id);
            }
          } else {
            resetAuth();
          }
        }
      } finally {
        release();
      }
    }
    // retry the initial query
    result = await baseQuery(args, api, extraOptions);
  }
  return result;
};

const api = createApi({
  reducerPath: "rootApi",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});

export default api;

import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import Cookies from "js-cookie";
import { IUserWithRefreshToken } from "../types/auth.types";
import { config } from "../config";

const mutex = new Mutex();

export const resetAuth = (): void => {
  Cookies.remove("token");
  Cookies.remove("exp");
};

const baseQuery = fetchBaseQuery({
  baseUrl: config.apiUrl,
  prepareHeaders: (headers) => {
    const token = Cookies.get("token");
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
        const token = Cookies.get("token");

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
            const userWithTokens = refreshResult.data as IUserWithRefreshToken;
            Cookies.set("token", userWithTokens.refreshedToken, {
              expires: 1 / 12,
            });
            Cookies.set("exp", userWithTokens.exp.toString());
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
  keepUnusedDataFor: 60,
  refetchOnMountOrArgChange: false,
  refetchOnReconnect: true,
  refetchOnFocus: false,
});

export default api;

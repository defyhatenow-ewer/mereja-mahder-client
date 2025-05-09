import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import { REHYDRATE } from "redux-persist";
import { IUserWithRefreshToken } from "../types/auth.types";
import { config } from "../config";
import { RootState } from "./store";
import { Action } from "@reduxjs/toolkit";

const mutex = new Mutex();

function isHydrateAction(action: Action): action is Action<typeof REHYDRATE> & {
  key: string;
  payload: RootState;
  err: unknown;
} {
  return action.type === REHYDRATE;
}

export const resetAuth = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("exp");
  localStorage.removeItem("userId");
};

const baseQuery = fetchBaseQuery({
  baseUrl: config.apiUrl,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
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
        const token = localStorage.getItem("token");

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
            localStorage.setItem("token", userWithTokens.refreshedToken);
            localStorage.setItem("exp", userWithTokens.exp.toString());
            localStorage.setItem("userId", userWithTokens.user.id);
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
  extractRehydrationInfo(
    action
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any {
    if (isHydrateAction(action)) {
      // when persisting the api reducer
      if (action.key === "root") {
        return action.payload;
      }

      // When persisting the root reducer
      return action.payload[api.reducerPath];
    }
  },
});

export default api;

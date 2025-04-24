import * as qs from "qs-esm";
import api from "../app/api";
import { IQueryFilter, IQueryResults } from "../types";
import { IUpdateResult } from "../types/common.types";
import { IMessage } from "../types/forums.types";

const apiWithMessageTags = api.enhanceEndpoints({
  addTagTypes: ["Message"],
});

const messageApi = apiWithMessageTags.injectEndpoints({
  endpoints: (builder) => ({
    createMessage: builder.mutation<
      IMessage,
      Omit<IMessage, "id" | "slug" | "slugLock">
    >({
      query: (body) => ({
        url: "messages",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Message"],
    }),
    getMessages: builder.query<IQueryResults<IMessage>, IQueryFilter>({
      query: (params) => {
        const filters = qs.stringify(params.query, { addQueryPrefix: true });
        return {
          url: `messages${filters}`,
          method: "GET",
          params: params.options,
        };
      },
      providesTags: (data) =>
        data && data.docs
          ? [
              ...data.docs.map(({ id }) => ({
                type: "Message" as const,
                id,
              })),
              { type: "Message", id: "PARTIAL-MESSAGE-LIST" },
            ]
          : [{ type: "Message", id: "PARTIAL-MESSAGE-LIST" }],
    }),
    getSingleMessage: builder.query<IMessage, Pick<IMessage, "id">>({
      query: ({ id }) => ({
        url: `messages/${id}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result ? [{ type: "Message", id: result.id }] : ["Message"],
    }),
    updateMessage: builder.mutation<
      IUpdateResult<IMessage>,
      {
        id: IMessage["id"];
        body: Partial<Omit<IMessage, "id" | "slug" | "slugLock">>;
      }
    >({
      query: ({ id, body }) => ({
        url: `messages/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Message", id: arg.id },
        { type: "Message", id: "PARTIAL-MESSAGE-LIST" },
      ],
    }),
    deleteMessage: builder.mutation<IMessage, Pick<IMessage, "id">>({
      query: ({ id }) => ({
        url: `messages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Message", id: arg.id },
        { type: "Message", id: "PARTIAL-MESSAGE-LIST" },
      ],
    }),
  }),
});

export const {
  useCreateMessageMutation,
  useGetMessagesQuery,
  useGetSingleMessageQuery,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
} = messageApi;
export default messageApi;

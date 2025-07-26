import * as qs from 'qs-esm';
import api from '../app/api';
import { IQueryFilter, IQueryResults } from '../types';
import { IUpdateResult } from '../types/common.types';
import { ISuggestion } from '../types/posts.types';

const apiWithSuggestionTags = api.enhanceEndpoints({
  addTagTypes: ['Suggestion'],
});

const suggestionApi = apiWithSuggestionTags.injectEndpoints({
  endpoints: (builder) => ({
    createSuggestion: builder.mutation<ISuggestion, Omit<ISuggestion, 'id'>>({
      query: (body) => ({
        url: 'suggestions',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Suggestion'],
    }),
    getSuggestions: builder.query<IQueryResults<ISuggestion>, IQueryFilter>({
      query: (params) => {
        const filters = qs.stringify(params.query, { addQueryPrefix: true });
        return {
          url: `suggestions${filters}`,
          method: 'GET',
          params: {
            sort: '-createdAt',
            ...params.options,
          },
        };
      },
      providesTags: (data) =>
        data && data.docs
          ? [
              ...data.docs.map(({ id }) => ({
                type: 'Suggestion' as const,
                id,
              })),
              { type: 'Suggestion', id: 'PARTIAL-SUGGESTION-LIST' },
            ]
          : [{ type: 'Suggestion', id: 'PARTIAL-SUGGESTION-LIST' }],
    }),
    getSingleSuggestion: builder.query<ISuggestion, Pick<ISuggestion, 'id'>>({
      query: ({ id }) => ({
        url: `suggestions/${id}`,
        method: 'GET',
      }),
      providesTags: (result) =>
        result ? [{ type: 'Suggestion', id: result.id }] : ['Suggestion'],
    }),
    updateSuggestion: builder.mutation<
      IUpdateResult<ISuggestion>,
      {
        id: ISuggestion['id'];
        body: Partial<Omit<ISuggestion, 'id'>>;
      }
    >({
      query: ({ id, body }) => ({
        url: `suggestions/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'Suggestion', id: arg.id },
        { type: 'Suggestion', id: 'PARTIAL-SUGGESTION-LIST' },
      ],
    }),
    deleteSuggestion: builder.mutation<ISuggestion, Pick<ISuggestion, 'id'>>({
      query: ({ id }) => ({
        url: `suggestions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'Suggestion', id: arg.id },
        { type: 'Suggestion', id: 'PARTIAL-SUGGESTION-LIST' },
      ],
    }),
  }),
});

export const {
  useCreateSuggestionMutation,
  useGetSuggestionsQuery,
  useGetSingleSuggestionQuery,
  useUpdateSuggestionMutation,
  useDeleteSuggestionMutation,
} = suggestionApi;
export default suggestionApi;

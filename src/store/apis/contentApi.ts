import { baseApi } from "./baseApi";
import type { ApiEnvelope } from "./authApi";

export interface ContentData {
  _id?: string;
  type: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrUpdateContentRequest {
  type: string;
  content: string;
}

export const contentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    retrieveContent: builder.query<ApiEnvelope<ContentData>, string>({
      query: (type) => `/content/retrieve/${type}`,
      providesTags: (_result, _error, type) => [{ type: "Content", id: type }],
    }),
    createOrUpdateContent: builder.mutation<ApiEnvelope<ContentData>, CreateOrUpdateContentRequest>({
      query: (body) => ({
        url: "/content/create-or-update",
        method: "POST", // assuming POST is used for create-or-update
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "Content", id: arg.type }],
    }),
  }),
});

export const {
  useRetrieveContentQuery,
  useCreateOrUpdateContentMutation,
} = contentApi;

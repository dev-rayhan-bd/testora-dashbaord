import { baseApi } from "./baseApi";

export interface IBlog {
  _id: string;
  title: string;
  category: string;
  status: string;
  seoTitle?: string;
  seoDescription?: string;
  content?: string;
  image?: string;
  views?: number;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogListResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    data: IBlog[];
  };
}

export interface SingleBlogResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: IBlog;
}

export interface GetBlogsParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: string;
  category?: string;
}

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query<BlogListResponse, GetBlogsParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.searchTerm) queryParams.append("searchTerm", params.searchTerm);
        if (params?.status && params.status !== "all") queryParams.append("status", params.status);
        if (params?.category && params.category !== "all") queryParams.append("category", params.category);
        
        return `/admin/blog/list?${queryParams.toString()}`;
      },
      providesTags: ["Blogs"],
    }),
    getSingleBlog: builder.query<SingleBlogResponse, string>({
      query: (id) => `/admin/blog/details/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Blogs" as const, id }],
    }),
    addBlog: builder.mutation<{ success: boolean; message: string; data: IBlog }, FormData>({
      query: (formData) => ({
        url: "/admin/blog/add",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Blogs"],
    }),
    updateBlog: builder.mutation<{ success: boolean; message: string; data: IBlog }, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/admin/blog/update/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Blogs"],
    }),
    deleteBlog: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/admin/blog/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blogs"],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetSingleBlogQuery,
  useAddBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;

import { baseApi } from "./baseApi";

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryListResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: ICategory[];
}

export interface GetCategoriesParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  isActive?: boolean;
}

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoryListResponse, GetCategoriesParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.searchTerm) queryParams.append("searchTerm", params.searchTerm);
        if (params?.isActive !== undefined) queryParams.append("isActive", params.isActive.toString());
        
        return `/categories/admin/all?${queryParams.toString()}`;
      },
      providesTags: ["Categories"],
    }),
    addCategory: builder.mutation<{ success: boolean; message: string; data: ICategory }, FormData>({
      query: (formData) => ({
        url: "/categories",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Categories"],
    }),
    updateCategory: builder.mutation<{ success: boolean; message: string; data: ICategory }, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Categories"],
    }),
    deleteCategory: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;

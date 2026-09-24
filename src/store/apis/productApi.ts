import { baseApi } from "./baseApi";

export type TProductStatus = "draft" | "active" | "hidden";

export interface IProductVariant {
  _id?: string;
  sku?: string;
  color?: string;
  size?: string;
  price?: number;
  compareAtPrice?: number | null;
  stock: number;
  image?: string;
}

export interface IProduct {
  _id: string;
  title: string;
  slug: string;
  sku: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  discountPercentage: number;
  savingsAmount: number;
  stock: number;
  status: TProductStatus;
  category: string | { _id: string; name: string };
  brand?: string;
  images: string[];
  variants: IProductVariant[];
  isDeleted: boolean;
  lowStockAlert: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: IProduct[];
}

export interface SingleProductResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: IProduct;
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: string;
  category?: string;
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductListResponse, GetProductsParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.searchTerm) queryParams.append("searchTerm", params.searchTerm);
        if (params?.status && params.status !== "all") queryParams.append("status", params.status);
        if (params?.category && params.category !== "all") queryParams.append("category", params.category);

        return `/admin/products/admin/all?${queryParams.toString()}`;
      },
      providesTags: ["Products"],
    }),
    getSingleProduct: builder.query<SingleProductResponse, string>({
      query: (id) => `/admin/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Products" as const, id }],
    }),
    addProduct: builder.mutation<{ success: boolean; message: string; data: IProduct }, FormData>({
      query: (formData) => ({
        url: "/admin/products",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: builder.mutation<{ success: boolean; message: string; data: IProduct }, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/admin/products/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Products", "Categories"],
    }),
    deleteProduct: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products", "Categories"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetSingleProductQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;

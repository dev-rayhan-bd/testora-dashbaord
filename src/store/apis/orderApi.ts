import { baseApi } from "./baseApi";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<any, { page?: number; limit?: number; searchTerm?: string; orderStatus?: string; paymentStatus?: string; paymentMethod?: string; startDate?: string; endDate?: string }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.searchTerm) queryParams.append("searchTerm", params.searchTerm);
        if (params.orderStatus && params.orderStatus !== "All") queryParams.append("orderStatus", params.orderStatus.toLowerCase());
        if (params.paymentStatus && params.paymentStatus !== "All") queryParams.append("paymentStatus", params.paymentStatus.toLowerCase());
        if (params.paymentMethod && params.paymentMethod !== "All") queryParams.append("paymentMethod", params.paymentMethod.toLowerCase());
        if (params.startDate) queryParams.append("startDate", params.startDate);
        if (params.endDate) queryParams.append("endDate", params.endDate);
        
        return {
          url: `/admin/orders/admin/all?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Orders"],
    }),
    
    getOrderDetails: builder.query<any, string>({
      query: (id) => ({
        url: `/admin/orders/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Orders", id }],
    }),

    updateOrderStatus: builder.mutation<any, { id: string; status: string; cancellationReason?: string }>({
      query: ({ id, ...body }) => ({
        url: `/admin/orders/admin/${id}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Orders"],
    }),

    addTrackingInfo: builder.mutation<any, { id: string; courierName: string; trackingNumber: string; trackingUrl?: string; estimatedDelivery?: string }>({
      query: ({ id, ...body }) => ({
        url: `/admin/orders/admin/${id}/tracking`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Orders"],
    }),

    refundOrder: builder.mutation<any, { id: string; reason: string; restockInventory: boolean }>({
      query: ({ id, ...body }) => ({
        url: `/admin/orders/admin/${id}/refund`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOrdersQuery,
  useGetOrderDetailsQuery,
  useUpdateOrderStatusMutation,
  useAddTrackingInfoMutation,
  useRefundOrderMutation,
} = orderApi;

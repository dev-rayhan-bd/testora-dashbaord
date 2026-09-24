"use client";

import { ChevronLeft, ChevronRight, Eye, Info, Search } from "lucide-react";
import { useState } from "react";
import { OrderStatusBadge, PaymentStatusBadge } from "./OrderBadges";
import OrderDetailsModal from "./OrderDetailsModal";
import { useGetOrdersQuery } from "@/store/apis";
import { format } from "date-fns";

function currency(value: number) {
  return "EUR " + value.toFixed(2);
}

export default function OrdersPage() {
  const [query, setQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const { data, isLoading } = useGetOrdersQuery({
    searchTerm: query,
    orderStatus: statusFilter,
    paymentStatus: paymentFilter,
    paymentMethod: methodFilter,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const handleResetFilters = () => {
    setQuery("");
    setPaymentFilter("All");
    setStatusFilter("All");
    setMethodFilter("All");
    setStartDate("");
    setEndDate("");
  };

  const orders = data?.data?.orders || data?.data || [];
  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-lg font-semibold text-[#3f5f7a]">Orders</h1>
      </div>

      <div className="rounded-lg border border-[#c8ddf2] bg-[#eaf4fd] px-3 py-2 text-xs text-[#5b83ab]">
        <p className="flex items-start gap-2 leading-relaxed">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2f86d8]" />
          <span>
            Marketplace Order Only. This section manages physical product purchases with shipping
            and delivery. Digital subscription packages (Semimatura, Matura, Entrance Exams) are
            managed separately in the Premium Users section.
          </span>
        </p>
        <p className="mt-1 pl-5 text-[11px] text-[#2f86d8]">
          Payment &amp; Order Status: Payment status tracks payment state (Paid, Unpaid, COD
          Pending, etc.). Order Status tracks fulfillment and delivery (New, Processing, Shipped,
          Delivered, etc.).
        </p>
      </div>


      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-[#dce7f2] bg-white p-2.5">
        <label className="relative min-w-64 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-[#9ab0c3]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Order ID, Name, or Phone..."
            className="h-9 w-full rounded-md border border-[#dce7f2] bg-[#f8fbff] pr-3 pl-8 text-sm text-[#3f5f7a] outline-none placeholder:text-[#9ab0c3]"
          />
        </label>
        
        <div className="flex items-center gap-2 rounded-md border border-[#dce7f2] bg-[#f8fbff] px-2.5 h-9">
          <span className="text-xs font-medium text-[#587189] whitespace-nowrap">Start Date:</span>
          <input 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-transparent text-sm text-[#587189] outline-none" 
          />
        </div>
        
        <div className="flex items-center gap-2 rounded-md border border-[#dce7f2] bg-[#f8fbff] px-2.5 h-9">
          <span className="text-xs font-medium text-[#587189] whitespace-nowrap">End Date:</span>
          <input 
            type="date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-transparent text-sm text-[#587189] outline-none" 
          />
        </div>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="h-9 min-w-40 rounded-md border border-[#dce7f2] bg-[#f8fbff] px-2.5 text-sm text-[#587189] outline-none"
        >
          <option value="All">All Payment Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 min-w-36 rounded-md border border-[#dce7f2] bg-[#f8fbff] px-2.5 text-sm text-[#587189] outline-none"
        >
          <option value="All">All Order Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
        </select>

        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="h-9 min-w-28 rounded-md border border-[#dce7f2] bg-[#f8fbff] px-2.5 text-sm text-[#587189] outline-none"
        >
          <option value="All">All Methods</option>
          <option value="cash_on_delivery">Cash On Delivery</option>
          <option value="stripe">Stripe (Card)</option>
        </select>

        {(query || paymentFilter !== "All" || statusFilter !== "All" || methodFilter !== "All" || startDate || endDate) && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#f2c5c5] bg-[#fdeeee] px-3 text-sm font-medium text-[#cf5d5d] hover:bg-[#facdcd] transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-[#dce7f2] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-305 text-left">
            <thead className="bg-[#f3f7fb] text-[10px] font-semibold tracking-wide text-[#6f859b] uppercase">
              <tr>
                <th className="px-3 py-2.5">Order ID</th>
                <th className="px-3 py-2.5">Date</th>
                <th className="px-3 py-2.5">Customer Name</th>
                <th className="px-3 py-2.5">Phone Number</th>
                <th className="px-3 py-2.5">Product / Items</th>
                <th className="px-3 py-2.5">Payment Method</th>
                <th className="px-3 py-2.5">Payment Status</th>
                <th className="px-3 py-2.5">Order Status</th>
                <th className="px-3 py-2.5">Total Amount</th>
                <th className="px-3 py-2.5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="px-4 py-10 text-center text-sm text-[#90a3b6]">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-10 text-center text-sm text-[#90a3b6]">
                    No orders match your filters.
                  </td>
                </tr>
              ) : (
                orders.map((order: any) => (
                  <tr
                    key={order._id}
                    className="border-b border-[#ecf2f8] text-xs text-[#5e768e] last:border-b-0 hover:bg-[#f8fbff]"
                  >
                    <td className="px-3 py-2.5 text-[#3571d5]">{order.orderNumber}</td>
                    <td className="px-3 py-2.5">{format(new Date(order.createdAt), "MMM dd, yyyy")}</td>
                    <td className="px-3 py-2.5">{order.shippingAddress?.fullName || order.user?.name}</td>
                    <td className="px-3 py-2.5">{order.shippingAddress?.phoneNumber}</td>
                    <td className="px-3 py-2.5">
                      <div className="max-w-[200px]">
                        <p className="truncate font-medium text-[#4f647a]" title={order.items?.[0]?.title}>
                          {order.items?.[0]?.title || "No item title"}
                        </p>
                        {order.items?.length > 1 && (
                          <span className="mt-1 inline-flex items-center rounded-full bg-[#eaf4fd] px-1.5 py-0.5 text-[10px] font-semibold text-[#2f86d8]">
                            +{order.items.length - 1} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 capitalize text-[#5e768e]">{order.payment?.method?.replace(/_/g, " ")}</td>
                    <td className="px-3 py-2.5">
                      <PaymentStatusBadge status={order.payment?.status} />
                    </td>
                    <td className="px-3 py-2.5">
                      <OrderStatusBadge status={order.orderStatus} />
                    </td>
                    <td className="px-3 py-2.5">{currency(order.pricing?.totalAmount || 0)}</td>
                    <td className="px-3 py-2.5">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="rounded p-1 text-[#4f81d5] hover:bg-[#f3f7fb]"
                        aria-label={`View ${order.orderNumber}`}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-[#ecf2f8] px-3 py-2 text-[11px] text-[#90a3b6]">
          <div className="flex items-center gap-1.5">
            <span>Rows per page:</span>
            <input
              value="10"
              readOnly
              className="h-5 w-8 rounded border border-[#dce7f2] bg-white px-1 text-center text-[11px] text-[#587189]"
            />
          </div>
          <div className="flex items-center gap-2">
            <span>Page 1 of 1</span>
            <button
              type="button"
              className="rounded p-0.5 text-[#9ab0c3] hover:bg-[#f3f7fb]"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              className="rounded p-0.5 text-[#9ab0c3] hover:bg-[#f3f7fb]"
              aria-label="Next page"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <OrderDetailsModal
        order={selectedOrder}
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}

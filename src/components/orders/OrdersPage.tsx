"use client";

import { orders, type Order } from "@/lib/orders-data";
import { ChevronLeft, ChevronRight, Download, Eye, Info, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { OrderStatusBadge, PaymentStatusBadge } from "./OrderBadges";
import OrderDetailsModal from "./OrderDetailsModal";

function currency(value: number) {
  return "EUR " + value.toFixed(2);
}

export default function OrdersPage() {
  const [query, setQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesQuery =
        !q ||
        order.id.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.phoneNumber.toLowerCase().includes(q);
      const matchesPayment = paymentFilter === "All" || order.paymentStatus === paymentFilter;
      const matchesStatus = statusFilter === "All" || order.orderStatus === statusFilter;
      const matchesMethod = methodFilter === "All" || order.paymentMethod === methodFilter;
      return matchesQuery && matchesPayment && matchesStatus && matchesMethod;
    });
  }, [query, paymentFilter, statusFilter, methodFilter]);

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

      <button
        type="button"
        className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#2f86d8] px-3 text-xs font-medium text-white hover:bg-[#2a78c6]"
      >
        <Download className="h-3.5 w-3.5" />
        Export CSV
      </button>

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

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="h-9 min-w-40 rounded-md border border-[#dce7f2] bg-[#f8fbff] px-2.5 text-sm text-[#587189] outline-none"
        >
          <option value="All">All Payment Status</option>
          <option value="Paid">Paid</option>
          <option value="COD Pending">COD Pending</option>
          <option value="Refunded">Refunded</option>
          <option value="Failed">Failed</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 min-w-36 rounded-md border border-[#dce7f2] bg-[#f8fbff] px-2.5 text-sm text-[#587189] outline-none"
        >
          <option value="All">All Order Status</option>
          <option value="New">New</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Returned">Returned</option>
        </select>

        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="h-9 min-w-28 rounded-md border border-[#dce7f2] bg-[#f8fbff] px-2.5 text-sm text-[#587189] outline-none"
        >
          <option value="All">All Methods</option>
          <option value="COD">COD</option>
          <option value="Card">Card</option>
        </select>
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
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-[#ecf2f8] text-xs text-[#5e768e] last:border-b-0 hover:bg-[#f8fbff]"
                >
                  <td className="px-3 py-2.5 text-[#3571d5]">{order.id}</td>
                  <td className="px-3 py-2.5">{order.date}</td>
                  <td className="px-3 py-2.5">{order.customerName}</td>
                  <td className="px-3 py-2.5">{order.phoneNumber}</td>
                  <td className="max-w-50 px-3 py-2.5">{order.productSummary}</td>
                  <td className="px-3 py-2.5">{order.paymentMethod}</td>
                  <td className="px-3 py-2.5">
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </td>
                  <td className="px-3 py-2.5">
                    <OrderStatusBadge status={order.orderStatus} />
                  </td>
                  <td className="px-3 py-2.5">{currency(order.totalAmount)}</td>
                  <td className="px-3 py-2.5">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="rounded p-1 text-[#4f81d5] hover:bg-[#f3f7fb]"
                      aria-label={`View ${order.id}`}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-10 text-center text-sm text-[#90a3b6]">
                    No orders match your filters.
                  </td>
                </tr>
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

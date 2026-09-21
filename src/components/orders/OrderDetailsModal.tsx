/* eslint-disable @next/next/no-img-element */
"use client";

import { type Order } from "@/lib/orders-data";
import { X } from "lucide-react";
import { OrderStatusBadge, PaymentStatusBadge } from "./OrderBadges";

type Props = {
  order: Order | null;
  open: boolean;
  onClose: () => void;
};

const sectionTitleClass = "mb-3 text-3xl font-semibold leading-none text-[#2f3f52]";

function currency(value: number) {
  return "EUR " + value.toFixed(2);
}

export default function OrderDetailsModal({ order, open, onClose }: Props) {
  if (!open || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#2d4056]/20 p-4 md:p-8">
      <div className="w-full max-w-4xl rounded-2xl border border-[#dce7f2] bg-white">
        <div className="flex items-start justify-between border-b border-[#e6edf5] px-6 py-5">
          <div>
            <h2 className="text-4xl leading-none font-semibold text-[#2f3f52]">Order Details</h2>
            <p className="mt-1 text-xs text-[#8ba0b4]">{order.id}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-[#8ea1b5] hover:bg-[#f4f8fc]"
            aria-label="Close details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <section className="rounded-xl border border-[#d3e2f3] bg-[#eef5fc] p-4">
            <h3 className="mb-3 text-3xl font-semibold text-[#2f3f52]">Order Summary</h3>
            <div className="mb-3 grid grid-cols-1 gap-3 text-sm text-[#5c738b] md:grid-cols-2">
              <div>
                <p className="text-[#7f94a8]">Order ID</p>
                <p className="font-medium text-[#3f5f7a]">{order.id}</p>
              </div>
              <div>
                <p className="text-[#7f94a8]">Order Date</p>
                <p className="font-medium text-[#3f5f7a]">{order.date}</p>
              </div>
            </div>
            <div className="space-y-1 border-t border-[#c9dcf1] pt-3 text-[#4f647a]">
              <div className="flex items-center justify-between text-sm">
                <span>Subtotal</span>
                <span>{currency(order.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Shipping Cost</span>
                <span>{currency(order.shippingCost)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between border-t border-[#c9dcf1] pt-2">
                <span className="text-xl font-medium">Total Amount</span>
                <span className="text-4xl font-semibold text-[#2f86d8]">
                  {currency(order.totalAmount)}
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#dce7f2] bg-white p-4">
            <h3 className={sectionTitleClass}>Customer Information</h3>
            <div className="grid grid-cols-1 gap-y-2 text-sm text-[#5c738b] md:grid-cols-2">
              <div>
                <p className="text-[#7f94a8]">Full Name</p>
                <p className="font-medium text-[#3f5f7a]">{order.customerName}</p>
              </div>
              <div>
                <p className="text-[#7f94a8]">Email</p>
                <p className="font-medium text-[#3f5f7a]">{order.customerEmail}</p>
              </div>
              <div>
                <p className="text-[#7f94a8]">Phone Number</p>
                <p className="font-medium text-[#3f5f7a]">{order.phoneNumber}</p>
              </div>
              <div>
                <p className="text-[#7f94a8]">City</p>
                <p className="font-medium text-[#3f5f7a]">{order.shipping.city}</p>
              </div>
              <div>
                <p className="text-[#7f94a8]">Full Address</p>
                <p className="font-medium text-[#3f5f7a]">{order.shipping.address}</p>
              </div>
              <div>
                <p className="text-[#7f94a8]">Country</p>
                <p className="font-medium text-[#3f5f7a]">{order.shipping.country}</p>
              </div>
              <div>
                <p className="text-[#7f94a8]">Postal Code</p>
                <p className="font-medium text-[#3f5f7a]">{order.shipping.postalCode}</p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#dce7f2] bg-white p-4">
            <h3 className={sectionTitleClass}>Shipping Information</h3>
            <div className="grid grid-cols-1 gap-y-2 text-sm text-[#5c738b] md:grid-cols-2">
              <div>
                <p className="text-[#7f94a8]">Courier Service</p>
                <p className="font-medium text-[#3f5f7a]">{order.shipping.courierService}</p>
              </div>
              <div>
                <p className="text-[#7f94a8]">Tracking Number</p>
                <p className="font-medium text-[#3f5f7a]">{order.shipping.trackingNumber}</p>
              </div>
              <div>
                <p className="text-[#7f94a8]">Shipping Status</p>
                <div className="mt-0.5">
                  <OrderStatusBadge status={order.orderStatus} />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#dce7f2] bg-white p-4">
            <h3 className={sectionTitleClass}>Ordered Items</h3>
            <div className="space-y-2">
              {order.items.length === 0 && (
                <div className="rounded-lg border border-[#ebf1f8] bg-[#f7fafd] px-3 py-3 text-sm text-[#8fa2b5]">
                  No line items available.
                </div>
              )}
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-[#ebf1f8] bg-[#f7fafd] px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-14 w-14 rounded-lg border border-[#dde8f3] object-cover"
                    />
                    <div>
                      <p className="text-lg font-medium text-[#33485f]">{item.title}</p>
                      <p className="text-sm text-[#6f8499]">
                        Quantity: {item.quantity} x {currency(item.unitPrice)}
                      </p>
                    </div>
                  </div>
                  <p className="text-xl font-medium text-[#445a73]">
                    {currency(item.quantity * item.unitPrice)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-[#dce7f2] bg-white p-4">
            <h3 className={sectionTitleClass}>Payment Information</h3>
            <div className="mb-3 grid grid-cols-1 gap-y-2 text-sm text-[#5c738b] md:grid-cols-2">
              <div>
                <p className="text-[#7f94a8]">Payment Method</p>
                <p className="font-medium text-[#3f5f7a]">{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-[#7f94a8]">Payment Status</p>
                <div className="mt-0.5">
                  <PaymentStatusBadge status={order.paymentStatus} />
                </div>
              </div>
            </div>

            {order.paymentMethod === "COD" && (
              <div className="rounded-lg border border-[#f0d495] bg-[#fff9e8] px-3 py-2 text-sm text-[#b96d1f]">
                <span className="font-semibold">COD Notice:</span> Payment will be collected upon
                delivery. Mark as Paid after successful payment collection.
              </div>
            )}
          </section>

          <section className="rounded-xl border border-[#dce7f2] bg-white p-4">
            <h3 className={sectionTitleClass}>Notes</h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="mb-1 text-[#7f94a8]">Customer Note</p>
                <div className="rounded-lg border border-[#f0d495] bg-[#fff9e8] px-3 py-2 text-[#465d75]">
                  {order.customerNote || "No note"}
                </div>
              </div>
              <div>
                <p className="mb-1 text-[#7f94a8]">Admin Note</p>
                <div className="rounded-lg border border-[#bdd5ee] bg-[#ebf3fb] px-3 py-2 text-[#465d75]">
                  {order.adminNote || "No note"}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[#e6edf5] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#d4e2ef] px-4 py-2 text-sm text-[#556f88] hover:bg-[#f5f9fd]"
          >
            Close
          </button>
          <button
            type="button"
            className="rounded-xl bg-[#2f86d8] px-4 py-2 text-sm font-medium text-white hover:bg-[#2a78c6]"
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useGetSingleProductQuery } from "@/store/apis/productApi";
import { ChevronLeft, Loader2, Pencil, Package, Tag, Layers, CheckCircle2, AlertCircle, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  productId: string;
};

export default function ProductDetailsPage({ productId }: Props) {
  const router = useRouter();
  const { data: productResponse, isLoading, isError } = useGetSingleProductQuery(productId);
  const product = productResponse?.data;

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-[#587189]">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-[#2f86d8]" />
        Loading product details...
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-[#587189]">
        <AlertCircle className="mb-2 h-8 w-8 text-rose-500" />
        <p>Failed to load product details or product not found.</p>
        <button onClick={() => router.back()} className="mt-4 text-[#2f86d8] hover:underline">
          Go Back
        </button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d5ece5] bg-[#e9f5f1] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#3ea666]">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Active
        </span>
      );
    }
    if (status === "draft") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f0dfb9] bg-[#fff3da] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#c48a2e]">
          <AlertCircle className="h-3.5 w-3.5" />
          Draft
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f4d7d7] bg-[#fdeeee] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#db6f6f]">
        <EyeOff className="h-3.5 w-3.5" />
        Hidden
      </span>
    );
  };

  const cardClass = "rounded-xl border border-[#dce7f2] bg-white p-5 shadow-xs";

  return (
    <div className="flex flex-col gap-5">
      {/* ── Top Bar ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/marketplace"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#dce7f2] bg-white text-[#587189] hover:bg-[#f8fbff]"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-[#3f5f7a]">{product.title}</h1>
              {getStatusBadge(product.status)}
            </div>
            <p className="text-xs text-[#90a3b6]">Product ID: {product._id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/marketplace/${product._id}/edit`}
            className="flex items-center gap-1.5 rounded-md bg-[#2f86d8] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2a78c6] transition-colors"
          >
            <Pencil className="h-4 w-4" />
            Edit Product
          </Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* ── Left Column ─────────────────────────────────────────────────── */}
        <div className="w-full flex-1 space-y-5">
          {/* Images */}
          {product.images && product.images.length > 0 && (
            <section className={cardClass}>
              <h2 className="mb-4 text-sm font-bold text-[#3f5f7a]">Product Gallery</h2>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((url, idx) => (
                  <div key={idx} className="h-40 w-40 shrink-0 overflow-hidden rounded-lg border border-[#dce7f2]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Product ${idx}`} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Description */}
          <section className={cardClass}>
            <h2 className="mb-4 text-sm font-bold text-[#3f5f7a]">Description</h2>
            <div 
              className="prose prose-sm max-w-none text-[#587189] prose-headings:text-[#3f5f7a]"
              dangerouslySetInnerHTML={{ __html: product.description || "No description provided." }} 
            />
          </section>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <section className={cardClass}>
              <div className="mb-4 flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#7e95ab]" />
                <h2 className="text-sm font-bold text-[#3f5f7a]">Variants</h2>
              </div>
              <div className="overflow-hidden rounded-lg border border-[#e5eff8]">
                <table className="w-full text-left text-sm text-[#587189]">
                  <thead className="bg-[#f5f9fd] text-xs font-semibold uppercase text-[#7e95ab]">
                    <tr>
                      <th className="px-4 py-2.5">Size</th>
                      <th className="px-4 py-2.5">Color</th>
                      <th className="px-4 py-2.5">Stock</th>
                      <th className="px-4 py-2.5">Extra Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5eff8] bg-white">
                    {product.variants.map((v, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2.5">{v.size || "-"}</td>
                        <td className="px-4 py-2.5">{v.color || "-"}</td>
                        <td className="px-4 py-2.5">
                          <span className={v.stock <= 0 ? "text-rose-500 font-medium" : ""}>
                            {v.stock}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">{v.price ? `+৳${v.price}` : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>

        {/* ── Right Column ────────────────────────────────────────────────── */}
        <div className="w-full lg:w-80 shrink-0 space-y-5">
          {/* Pricing & Inventory */}
          <section className={cardClass}>
            <h2 className="mb-4 text-sm font-bold text-[#3f5f7a]">Pricing & Inventory</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[#e5eff8]">
                <span className="text-xs text-[#7e95ab]">Price</span>
                <div className="text-right">
                  <span className="text-lg font-bold text-[#3f5f7a]">৳{product.price}</span>
                  {product.compareAtPrice && (
                    <span className="ml-2 text-xs text-[#90a3b6] line-through">৳{product.compareAtPrice}</span>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#e5eff8]">
                <span className="text-xs text-[#7e95ab]">Stock</span>
                <span className={`font-medium ${product.stock <= product.lowStockAlert ? 'text-rose-500' : 'text-[#3f5f7a]'}`}>
                  {product.stock} units
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#e5eff8]">
                <span className="text-xs text-[#7e95ab]">Low Stock Alert</span>
                <span className="font-medium text-[#3f5f7a]">{product.lowStockAlert}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#7e95ab]">SKU</span>
                <span className="font-medium text-[#3f5f7a]">{product.sku || "N/A"}</span>
              </div>
            </div>
          </section>

          {/* Organization */}
          <section className={cardClass}>
            <h2 className="mb-4 text-sm font-bold text-[#3f5f7a]">Organization</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[#e5eff8]">
                <span className="text-xs text-[#7e95ab] flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" /> Category</span>
                <span className="font-medium text-[#3f5f7a]">
                  {typeof product.category === 'object' ? product.category.name : "Category"}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#e5eff8]">
                <span className="text-xs text-[#7e95ab] flex items-center gap-1.5"><Package className="h-3.5 w-3.5" /> Brand</span>
                <span className="font-medium text-[#3f5f7a]">{product.brand || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#e5eff8]">
                <span className="text-xs text-[#7e95ab]">Created</span>
                <span className="text-xs font-medium text-[#3f5f7a]">
                  {new Date(product.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#7e95ab]">Last Updated</span>
                <span className="text-xs font-medium text-[#3f5f7a]">
                  {new Date(product.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

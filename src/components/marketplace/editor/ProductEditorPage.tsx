"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2, Save, Upload, X, ImageIcon, Plus, Trash2, ChevronDown } from "lucide-react";
import { useAddProductMutation, useUpdateProductMutation, useGetSingleProductQuery, TProductStatus, IProductVariant } from "@/store/apis/productApi";
import { useGetCategoriesQuery } from "@/store/apis/categoryApi";
import { toast } from "sonner";
import RichTextToolbar from "@/components/blog/editor/RichTextToolbar";

type Props = {
  productId?: string;
};

export default function ProductEditorPage({ productId }: Props) {
  const router = useRouter();
  const isEditing = !!productId;

  const { data: productResponse, isLoading: isLoadingProduct, isError: isErrorProduct } = useGetSingleProductQuery(productId || "", {
    skip: !productId,
  });
  const existingProduct = productResponse?.data;

  useEffect(() => {
    if (isErrorProduct) {
      toast.error("Failed to load product details.");
    }
  }, [isErrorProduct]);

  const { data: categoriesData, isLoading: isLoadingCategories } = useGetCategoriesQuery({ limit: 100 });
  const categories = categoriesData?.data || [];

  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const isSaving = isAdding || isUpdating;

  // --- Form State ---
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<string>("");
  const [compareAtPrice, setCompareAtPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [lowStockAlert, setLowStockAlert] = useState<string>("5");
  const [status, setStatus] = useState<TProductStatus>("draft");
  const [brand, setBrand] = useState("");
  
  // Media State
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<{ file: File; url: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Variants State
  const [variants, setVariants] = useState<IProductVariant[]>([]);

  useEffect(() => {
    if (existingProduct) {
      setTitle(existingProduct.title || "");
      setDescription(existingProduct.description || "");
      setCategory(typeof existingProduct.category === "object" ? existingProduct.category._id : (existingProduct.category || ""));
      setPrice(existingProduct.price?.toString() || "");
      setCompareAtPrice(existingProduct.compareAtPrice?.toString() || "");
      setStock(existingProduct.stock?.toString() || "");
      setLowStockAlert(existingProduct.lowStockAlert?.toString() || "5");
      setStatus(existingProduct.status || "draft");
      setBrand(existingProduct.brand || "");
      setExistingImages(existingProduct.images || []);
      setVariants(existingProduct.variants || []);
    }
  }, [existingProduct]);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    
    // Add to files state
    setNewImageFiles((prev) => [...prev, ...newFiles]);
    
    // Create previews
    const newPreviews = newFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
    
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeNewImage = (index: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      const newUrls = [...prev];
      URL.revokeObjectURL(newUrls[index].url);
      newUrls.splice(index, 1);
      return newUrls;
    });
  };

  const removeExistingImage = (index: number) => {
    // In a real app, you might want to track deleted images to send to the backend.
    // For now, we'll just remove it from the UI state.
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // --- Variant Handlers ---
  const addVariant = () => {
    setVariants([...variants, { sku: "", color: "", size: "", stock: 0, price: undefined }]);
  };

  const updateVariant = (index: number, field: keyof IProductVariant, value: string | number) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !price || !stock) {
      toast.error("Please fill in all required fields (Title, Category, Price, Stock)");
      return;
    }

    const formData = new FormData();
    
    // Data Object
    const dataObj: any = {
      title,
      description,
      category,
      price: Number(price),
      stock: Number(stock),
      status,
      lowStockAlert: Number(lowStockAlert),
    };

    if (compareAtPrice) dataObj.compareAtPrice = Number(compareAtPrice);
    if (brand) dataObj.brand = brand;
    if (variants.length > 0) dataObj.variants = variants;
    
    // If editing, we also need to send the remaining existing images (some might have been deleted)
    if (isEditing) {
      dataObj.images = existingImages;
    }

    formData.append("data", JSON.stringify(dataObj));

    // Append new image files (must match backend expected field, often 'images' array)
    newImageFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      if (isEditing) {
        await updateProduct({ id: productId!, formData }).unwrap();
        toast.success("Product updated successfully!");
      } else {
        await addProduct(formData).unwrap();
        toast.success("Product created successfully!");
        router.push("/marketplace");
      }
    } catch (err: any) {
      if (err?.data?.errors && typeof err.data.errors === 'object') {
        const errorMessages = Object.values(err.data.errors).join(", ");
        toast.error(`Validation failed: ${errorMessages}`);
      } else {
        toast.error(err?.data?.message || "Something went wrong.");
      }
    }
  };

  if (isEditing && isLoadingProduct) {
    return (
      <div className="flex items-center justify-center py-20 text-[#587189]">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-[#2f86d8]" />
        Loading product data...
      </div>
    );
  }

  const inputClass = "w-full rounded-md border border-[#dce7f2] bg-[#f8fbff] px-3 py-2 text-sm text-[#3f5f7a] outline-none placeholder:text-[#9ab0c3] focus:border-[#2f86d8]";
  const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#587189]";
  const cardClass = "rounded-xl border border-[#dce7f2] bg-white p-5 shadow-xs";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-[1400px] mx-auto pb-10">
      {/* ── Top Bar ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#f3f7fb] to-white p-5 border border-[#dce7f2] shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/marketplace"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#dce7f2] bg-white text-[#587189] hover:bg-[#eef3f8] hover:text-[#2f86d8] transition-all shadow-xs"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-[#273d52] tracking-tight">
              {isEditing ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-sm text-[#7e95ab] mt-0.5">Fill in the information below to {isEditing ? "update" : "create"} a product.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/marketplace"
            className="rounded-xl border border-[#dce7f2] bg-white px-5 py-2.5 text-sm font-bold text-[#587189] hover:bg-[#f8fbff] hover:text-[#3f5f7a] shadow-xs transition-all"
          >
            Discard
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-b from-[#3a93e5] to-[#2f86d8] px-6 py-2.5 text-sm font-bold text-white shadow-[0_2px_10px_rgba(47,134,216,0.3)] hover:shadow-[0_4px_15px_rgba(47,134,216,0.4)] disabled:opacity-50 transition-all active:scale-[0.98]"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isEditing ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* ── Left Column (Main Content) ────────────────────────────────────── */}
        <div className="w-full flex-1 space-y-5">
          {/* Basic Info */}
          <section className={cardClass}>
            <h2 className="mb-4 text-sm font-bold text-[#3f5f7a]">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Product Title <span className="text-rose-500">*</span></label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Testora Math Formula Sheet 2026"
                  className={inputClass}
                />
              </div>
              
              <div>
                <label className={labelClass}>Description <span className="text-rose-500">*</span></label>
                <div className="flex flex-col rounded-lg border border-[#dce7f2] overflow-hidden">
                  <RichTextToolbar />
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter detailed product description..."
                    className="min-h-[200px] w-full resize-y bg-[#f8fbff] p-4 text-sm text-[#3f5f7a] outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Media */}
          <section className={cardClass}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#3f5f7a]">Media</h2>
              <span className="text-xs text-[#90a3b6]">Max 5MB per image</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {/* Existing Images */}
              {existingImages.map((url, idx) => (
                <div key={url} className="group relative aspect-square overflow-hidden rounded-lg border border-[#dce7f2] bg-[#f8fbff]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="existing" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(idx)}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-rose-500 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              {/* New Images */}
              {previewUrls.map((preview, idx) => (
                <div key={idx} className="group relative aspect-square overflow-hidden rounded-lg border border-[#dce7f2] bg-[#f8fbff]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview.url} alt="preview" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(idx)}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-rose-500 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {/* Upload Button */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#c0d8ee] bg-[#f8fbff] text-[#7e95ab] transition-colors hover:border-[#2f86d8] hover:bg-[#f0f7fe] hover:text-[#2f86d8]"
              >
                <Plus className="mb-1 h-6 w-6" />
                <span className="text-[10px] font-medium uppercase tracking-wider">Add Image</span>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
          </section>

          {/* Pricing & Inventory */}
          <section className={cardClass}>
            <h2 className="mb-4 text-sm font-bold text-[#3f5f7a]">Pricing & Inventory</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Price (৳) <span className="text-rose-500">*</span></label>
                <input
                  required
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Compare at Price (৳)</label>
                <input
                  type="number"
                  min="0"
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value)}
                  placeholder="0.00"
                  className={inputClass}
                />
                <p className="mt-1 text-[10px] text-[#90a3b6]">To show a strike-through discount.</p>
              </div>
              <div>
                <label className={labelClass}>Stock Quantity <span className="text-rose-500">*</span></label>
                <input
                  required
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0"
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Low Stock Alert</label>
                <input
                  type="number"
                  min="0"
                  value={lowStockAlert}
                  onChange={(e) => setLowStockAlert(e.target.value)}
                  placeholder="5"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* Variants */}
          <section className={cardClass}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#3f5f7a]">Variants (Optional)</h2>
                <p className="text-xs text-[#90a3b6]">Add variants like different sizes or colors.</p>
              </div>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-1 rounded-md border border-[#dce7f2] px-2.5 py-1.5 text-xs font-semibold text-[#2f86d8] hover:bg-[#f8fbff]"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Variant
              </button>
            </div>
            
            {variants.length > 0 ? (
              <div className="space-y-3">
                {variants.map((v, idx) => (
                  <div key={idx} className="flex flex-wrap gap-3 rounded-lg border border-[#e5eff8] bg-[#fdfdfe] p-3 shadow-xs">
                    <div className="flex-1 min-w-[120px]">
                      <label className="mb-1 block text-[10px] font-semibold text-[#7e95ab]">Size</label>
                      <input value={v.size || ""} onChange={(e) => updateVariant(idx, "size", e.target.value)} placeholder="e.g. XL" className={`${inputClass} !py-1.5`} />
                    </div>
                    <div className="flex-1 min-w-[120px]">
                      <label className="mb-1 block text-[10px] font-semibold text-[#7e95ab]">Color</label>
                      <input value={v.color || ""} onChange={(e) => updateVariant(idx, "color", e.target.value)} placeholder="e.g. Red" className={`${inputClass} !py-1.5`} />
                    </div>
                    <div className="flex-1 min-w-[100px]">
                      <label className="mb-1 block text-[10px] font-semibold text-[#7e95ab]">Stock</label>
                      <input type="number" value={v.stock} onChange={(e) => updateVariant(idx, "stock", Number(e.target.value))} placeholder="0" className={`${inputClass} !py-1.5`} />
                    </div>
                    <div className="flex-1 min-w-[100px]">
                      <label className="mb-1 block text-[10px] font-semibold text-[#7e95ab]">Price (+৳)</label>
                      <input type="number" value={v.price || ""} onChange={(e) => updateVariant(idx, "price", Number(e.target.value))} placeholder="Optional" className={`${inputClass} !py-1.5`} />
                    </div>
                    <div className="flex items-end">
                      <button type="button" onClick={() => removeVariant(idx)} className="mb-1 flex h-8 w-8 items-center justify-center rounded-md text-[#9ab0c3] hover:bg-rose-50 hover:text-rose-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-[#dce7f2] bg-[#f8fbff] p-6 text-center text-sm text-[#90a3b6]">
                No variants added yet.
              </div>
            )}
          </section>
        </div>

        {/* ── Right Column (Sidebar) ────────────────────────────────────────── */}
        <div className="w-full lg:w-80 shrink-0 space-y-5">
          {/* Status */}
          <section className={cardClass}>
            <h2 className="mb-3 text-sm font-bold text-[#3f5f7a]">Product Status</h2>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TProductStatus)}
                className={`${inputClass} appearance-none pr-8 font-medium`}
              >
                <option value="active">Active (Visible)</option>
                <option value="draft">Draft (Hidden)</option>
                <option value="hidden">Hidden (Archived)</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center">
                <div className={`mr-2 h-2 w-2 rounded-full ${status === 'active' ? 'bg-[#3ea666]' : status === 'draft' ? 'bg-[#c48a2e]' : 'bg-[#db6f6f]'}`} />
                <ChevronDown className="h-4 w-4 text-[#9ab0c3]" />
              </div>
            </div>
            <p className="mt-2 text-[10px] text-[#90a3b6]">
              Hidden products are not visible to customers but still exist in the database.
            </p>
          </section>

          {/* Organization */}
          <section className={cardClass}>
            <h2 className="mb-3 text-sm font-bold text-[#3f5f7a]">Organization</h2>
            
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Category <span className="text-rose-500">*</span></label>
                {isLoadingCategories ? (
                  <div className="flex h-9 items-center justify-center rounded-md border border-[#dce7f2] bg-[#f8fbff]">
                    <Loader2 className="h-4 w-4 animate-spin text-[#9ab0c3]" />
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={`${inputClass} appearance-none pr-8`}
                    >
                      <option value="" disabled>Select category...</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9ab0c3]" />
                  </div>
                )}
              </div>

              <div>
                <label className={labelClass}>Brand</label>
                <input
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Testora"
                  className={inputClass}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}

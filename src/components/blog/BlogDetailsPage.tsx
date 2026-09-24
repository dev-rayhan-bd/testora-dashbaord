"use client";

import { useGetSingleBlogQuery } from "@/store/apis/blogApi";
import { ChevronLeft, Loader2, Pencil, Calendar, Tag, AlertCircle, Eye, Search, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  blogId: string;
};

export default function BlogDetailsPage({ blogId }: Props) {
  const router = useRouter();
  const { data: blogResponse, isLoading, isError } = useGetSingleBlogQuery(blogId);
  const blog = blogResponse?.data;

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-[#587189]">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-[#2f86d8]" />
        Loading blog details...
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-[#587189]">
        <AlertCircle className="mb-2 h-8 w-8 text-rose-500" />
        <p>Failed to load blog details or blog not found.</p>
        <button onClick={() => router.back()} className="mt-4 text-[#2f86d8] hover:underline">
          Go Back
        </button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    if (status === "published") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d5ece5] bg-[#e9f5f1] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#3ea666]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#3ea666]" />
          Published
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f0dfb9] bg-[#fff3da] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#c48a2e]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#c48a2e]" />
        Draft
      </span>
    );
  };

  const cardClass = "rounded-xl border border-[#dce7f2] bg-white p-5 shadow-xs";

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto pb-10">
      {/* ── Top Bar ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#f3f7fb] to-white p-5 border border-[#dce7f2] shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/blog"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#dce7f2] bg-white text-[#587189] hover:bg-[#eef3f8] hover:text-[#2f86d8] transition-all shadow-xs"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-[#273d52] tracking-tight">{blog.title}</h1>
              {getStatusBadge(blog.status)}
            </div>
            <p className="text-sm text-[#7e95ab] mt-0.5">Blog ID: {blog._id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/blog/${blog._id}/edit`}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-b from-[#3a93e5] to-[#2f86d8] px-6 py-2.5 text-sm font-bold text-white shadow-[0_2px_10px_rgba(47,134,216,0.3)] hover:shadow-[0_4px_15px_rgba(47,134,216,0.4)] transition-all active:scale-[0.98]"
          >
            <Pencil className="h-4 w-4" />
            Edit Article
          </Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* ── Left Column (Main Content) ────────────────────────────────────── */}
        <div className="w-full flex-1 space-y-6">
          {/* Article Header & Image */}
          <section className="overflow-hidden rounded-2xl border border-[#dce7f2] bg-white shadow-sm">
            {blog.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={blog.image} alt={blog.title} className="w-full h-[350px] object-cover bg-[#f8fbff]" />
            ) : (
              <div className="w-full h-[200px] bg-[#f8fbff] flex items-center justify-center border-b border-[#dce7f2]">
                <span className="text-[#9ab0c3] text-sm">No featured image</span>
              </div>
            )}
            
            <div className="p-6">
              <div className="mb-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#7e95ab]">
                <div className="flex items-center gap-1.5">
                  <Tag className="h-4 w-4 text-[#2f86d8]" />
                  {blog.category}
                </div>
                {blog.publishedAt && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {new Date(blog.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4" />
                  {blog.views || 0} Views
                </div>
              </div>
              <h2 className="text-2xl font-bold text-[#3f5f7a] mb-6">{blog.title}</h2>
              
              {/* HTML Content */}
              <div 
                className="prose prose-slate max-w-none prose-headings:text-[#3f5f7a] prose-a:text-[#2f86d8] prose-img:rounded-xl text-[#587189]"
                dangerouslySetInnerHTML={{ __html: blog.content || "No content provided." }} 
              />
            </div>
          </section>
        </div>

        {/* ── Right Column (Sidebar) ────────────────────────────────────────── */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          
          {/* SEO Details */}
          <section className={cardClass}>
            <div className="mb-4 flex items-center gap-2">
              <Search className="h-4 w-4 text-[#2f86d8]" />
              <h2 className="text-sm font-bold text-[#3f5f7a]">SEO Information</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#90a3b6] mb-1">SEO Title</span>
                <p className="text-sm font-medium text-[#3f5f7a]">{blog.seoTitle || "Not set"}</p>
              </div>
              
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#90a3b6] mb-1">SEO Description</span>
                <p className="text-sm text-[#587189]">{blog.seoDescription || "Not set"}</p>
              </div>
              

            </div>
          </section>

          {/* Timestamps */}
          <section className={cardClass}>
            <h2 className="mb-4 text-sm font-bold text-[#3f5f7a]">Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-[#e5eff8]">
                <span className="text-xs text-[#7e95ab]">Created At</span>
                <span className="text-xs font-medium text-[#3f5f7a]">
                  {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#e5eff8]">
                <span className="text-xs text-[#7e95ab]">Last Updated</span>
                <span className="text-xs font-medium text-[#3f5f7a]">
                  {blog.updatedAt ? new Date(blog.updatedAt).toLocaleDateString() : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#7e95ab]">Status</span>
                <span className="text-xs font-medium capitalize text-[#3f5f7a]">{blog.status}</span>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

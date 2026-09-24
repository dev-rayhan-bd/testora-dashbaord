"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Eye, FileEdit, Globe, Pencil, Check, Loader2 } from "lucide-react";
import RichTextToolbar from "./RichTextToolbar";
import ThumbnailUploadSection from "./ThumbnailUploadSection";
import SeoSettingsSection from "./SeoSettingsSection";
import ArticleSidebar from "./ArticleSidebar";
import { useGetSingleBlogQuery, useAddBlogMutation, useUpdateBlogMutation } from "@/store/apis/blogApi";
import { toast } from "sonner";
import { BLOG_STATUS } from "../BlogBadges";

type Props = {
  blogId?: string;
};

type SeoData = {
  seoTitle: string;
  metaDescription: string;
  ogImageUrl: string;
};

type SidebarState = {
  status: string;
  category: string;
  author: string;
  publishDate: string;
};

export default function ArticleEditorPage({ blogId }: Props) {
  const router = useRouter();
  
  // Fetch if editing
  const { data: blogResponse, isLoading: isLoadingBlog } = useGetSingleBlogQuery(blogId || "", {
    skip: !blogId,
  });
  const existingBlog = blogResponse?.data;

  // Mutations
  const [addBlog, { isLoading: isAdding }] = useAddBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  
  const [seo, setSeo] = useState<SeoData>({
    seoTitle: "",
    metaDescription: "",
    ogImageUrl: "",
  });
  
  const [sidebar, setSidebar] = useState<SidebarState>({
    status: BLOG_STATUS.DRAFT,
    category: "",
    author: "Testora Team",
    publishDate: "",
  });

  // Populate form if editing
  useEffect(() => {
    if (existingBlog) {
      setTitle(existingBlog.title || "");
      setContent(existingBlog.content || "");
      setThumbnailUrl(existingBlog.image || null);
      setSeo({
        seoTitle: existingBlog.seoTitle || "",
        metaDescription: existingBlog.seoDescription || "",
        ogImageUrl: existingBlog.image || "",
      });
      setSidebar({
        status: existingBlog.status || BLOG_STATUS.DRAFT,
        category: existingBlog.category || "",
        author: "Testora Team",
        publishDate: existingBlog.publishedAt || "",
      });
    }
  }, [existingBlog]);

  const handleTitleChange = useCallback((val: string) => {
    setTitle(val);
  }, []);

  const handleSidebarChange = (field: keyof SidebarState, value: string) => {
    setSidebar((prev) => ({ ...prev, [field]: value }));
  };

  const handleThumbnailChange = (file: File | null, url: string | null) => {
    setThumbnailFile(file);
    setThumbnailUrl(url);
  };

  const isEditing = !!blogId;
  const isSaving = isAdding || isUpdating;
  const pageTitle = isEditing ? (title || "Edit Article") : "New Article";

  const handleSubmit = async (overrideStatus?: string) => {
    if (!title) {
      toast.error("Title is required");
      return;
    }
    if (!sidebar.category) {
      toast.error("Category is required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", sidebar.category);
    formData.append("status", overrideStatus || sidebar.status);
    
    if (seo.seoTitle) formData.append("seoTitle", seo.seoTitle);
    if (seo.metaDescription) formData.append("seoDescription", seo.metaDescription);
    
    if (thumbnailFile) {
      formData.append("blog_image", thumbnailFile);
    }

    try {
      if (isEditing) {
        await updateBlog({ id: blogId, formData }).unwrap();
        toast.success("Blog updated successfully!");
      } else {
        await addBlog(formData).unwrap();
        toast.success("Blog created successfully!");
        router.push("/blog");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "An error occurred");
    }
  };

  if (blogId && isLoadingBlog) {
    return (
      <div className="flex items-center justify-center py-20 text-[#587189]">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-[#2f86d8]" />
        Loading article data...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0">
      {/* Top bar */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/blog"
            className="flex items-center gap-1 text-sm text-[#587189] hover:text-[#3f5f7a]"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Articles
          </Link>
          <span className="text-[#dce7f2]">/</span>
          <h1 className="text-sm font-semibold text-[#3f5f7a] truncate max-w-70">
            {pageTitle}
          </h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSubmit(BLOG_STATUS.DRAFT)}
            className="flex items-center gap-1.5 rounded-md border border-[#dce7f2] px-3 py-1.5 text-xs text-[#587189] hover:bg-[#f3f7fb] disabled:opacity-50"
          >
            {isSaving && sidebar.status === BLOG_STATUS.DRAFT ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileEdit className="h-3.5 w-3.5" />}
            Save Draft
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSubmit(BLOG_STATUS.PUBLISHED)}
            className="flex items-center gap-1.5 rounded-md bg-[#2f86d8] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#2a78c6] disabled:opacity-50"
          >
            {isSaving && sidebar.status === BLOG_STATUS.PUBLISHED ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Globe className="h-3.5 w-3.5" />}
            Publish
          </button>
        </div>
      </div>

      <div className="flex gap-4 items-start flex-col lg:flex-row">
        {/* Left column */}
        <div className="min-w-0 flex-1 space-y-4 w-full">
          {/* Article title */}
          <div className="rounded-lg border border-[#dce7f2] bg-white p-4">
            <input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Article Title"
              className="w-full text-2xl font-semibold text-[#3f5f7a] placeholder:text-[#c5d4e2] outline-none bg-transparent"
            />
          </div>

          {/* Editor block */}
          <div className="flex min-h-[400px] flex-col rounded-lg border border-[#dce7f2] bg-white shadow-xs">
            <RichTextToolbar />
            <div className="flex-1 p-0">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article content here... (HTML supported)"
                className="h-full min-h-[300px] w-full resize-none p-5 text-sm leading-relaxed text-[#3f5f7a] outline-none placeholder:text-[#c5d4e2]"
              />
            </div>
            <div className="border-t border-[#e5eff8] bg-[#f5f9fd] px-4 py-2 text-right text-[10px] text-[#90a3b6]">
              {content.trim().split(/\s+/).filter(Boolean).length} words
            </div>
          </div>
        </div>

        {/* Right column (Sidebar) */}
        <div className="w-full lg:w-80 shrink-0 space-y-4">
          <ArticleSidebar
            data={sidebar}
            onChange={handleSidebarChange}
            wordCount={content.trim().split(/\s+/).filter(Boolean).length}
            onPublish={() => handleSubmit(BLOG_STATUS.PUBLISHED)}
          />
          <ThumbnailUploadSection
            previewUrl={thumbnailUrl}
            onChange={handleThumbnailChange}
          />
          <SeoSettingsSection
            data={seo}
            onChange={(f, v) => setSeo((p) => ({ ...p, [f]: v }))}
            articleTitle={title}
            slug={title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")}
          />
        </div>
      </div>
    </div>
  );
}

/* eslint-disable @next/next/no-img-element */
import { type IBlog } from "@/store/apis/blogApi";
import { CategoryBadge, StatusBadge } from "./BlogBadges";
import { FileText, Pencil, Trash2, Eye } from "lucide-react";
import Link from "next/link";

type Props = {
  article: IBlog;
  onDelete: (id: string) => void;
};

export default function ArticleTableRow({ article, onDelete }: Props) {
  return (
    <tr className="border-b border-[#ecf2f8] text-xs text-[#5e768e] last:border-b-0 hover:bg-[#f8fbff]">
      {/* Thumbnail */}
      <td className="px-3 py-2.5">
        <div className="h-10 w-14 overflow-hidden rounded-md border border-[#dce7f2] bg-[#f3f7fb] flex items-center justify-center shrink-0">
          {article.image ? (
            <img
              src={article.image}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <FileText className="h-4 w-4 text-[#b4cfe8]" />
          )}
        </div>
      </td>

      {/* Title + seo title */}
      <td className="max-w-xs px-3 py-2.5">
        <p className="truncate font-medium text-[#3f5f7a]">{article.title}</p>
        <p className="mt-0.5 truncate text-[10px] text-[#9ab0c3]">
          {article.seoTitle || "No SEO Title"}
        </p>
      </td>

      {/* Category */}
      <td className="px-3 py-2.5">
        <CategoryBadge category={article.category} />
      </td>

      {/* Status */}
      <td className="px-3 py-2.5">
        <StatusBadge status={article.status} />
      </td>

      {/* Publish date */}
      <td className="px-3 py-2.5 text-[#7e95ab]">
        {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : <span className="text-[#c0cedc]">—</span>}
      </td>

      {/* Views */}
      <td className="px-3 py-2.5 text-[#7e95ab]">
        {article.views !== null && article.views !== undefined ? article.views.toLocaleString() : <span className="text-[#c0cedc]">—</span>}
      </td>

      {/* Actions */}
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-1">
          <Link
            href={`/blog/${article._id}`}
            className="flex h-7 w-7 items-center justify-center rounded-md text-[#587189] hover:bg-[#f3f7fb] hover:text-[#2f86d8] transition-colors"
            title="View Article"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <Link
            href={`/blog/${article._id}/edit`}
            className="flex h-7 w-7 items-center justify-center rounded-md text-[#587189] hover:bg-[#f3f7fb] hover:text-[#2f86d8] transition-colors"
            title="Edit Article"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            onClick={() => onDelete(article._id)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-[#587189] hover:bg-rose-50 hover:text-rose-600 transition-colors"
            title="Delete Article"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

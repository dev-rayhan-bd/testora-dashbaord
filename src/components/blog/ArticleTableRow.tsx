/* eslint-disable @next/next/no-img-element */
import { type Article, type ArticleStatus } from "@/lib/blog-data";
import { CategoryBadge, StatusBadge } from "./BlogBadges";
import ArticleActionsMenu from "./ArticleActionsMenu";
import { FileText } from "lucide-react";

type Props = {
  article: Article;
  onStatusChange: (id: string, status: ArticleStatus) => void;
  onDelete: (id: string) => void;
};

export default function ArticleTableRow({ article, onStatusChange, onDelete }: Props) {
  return (
    <tr className="border-b border-[#ecf2f8] text-xs text-[#5e768e] last:border-b-0 hover:bg-[#f8fbff]">
      {/* Thumbnail */}
      <td className="px-3 py-2.5">
        <div className="h-10 w-14 overflow-hidden rounded-md border border-[#dce7f2] bg-[#f3f7fb] flex items-center justify-center shrink-0">
          {article.thumbnailUrl ? (
            <img
              src={article.thumbnailUrl}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <FileText className="h-4 w-4 text-[#b4cfe8]" />
          )}
        </div>
      </td>

      {/* Title + slug + read time */}
      <td className="max-w-xs px-3 py-2.5">
        <p className="truncate font-medium text-[#3f5f7a]">{article.title}</p>
        <p className="mt-0.5 truncate text-[10px] text-[#9ab0c3]">
          {article.slug} · {article.readTime}
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
        {article.publishDate ?? <span className="text-[#c0cedc]">—</span>}
      </td>

      {/* Views */}
      <td className="px-3 py-2.5 text-[#7e95ab]">
        {article.views !== null ? article.views.toLocaleString() : <span className="text-[#c0cedc]">—</span>}
      </td>

      {/* Actions */}
      <td className="px-3 py-2.5">
        <ArticleActionsMenu
          articleId={article.id}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      </td>
    </tr>
  );
}

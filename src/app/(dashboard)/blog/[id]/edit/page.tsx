import { articles } from "@/lib/blog-data";
import ArticleEditorPage from "@/components/blog/editor/ArticleEditorPage";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  const article = articles.find((a) => a.id === id);
  return <ArticleEditorPage initialArticle={article} />;
}

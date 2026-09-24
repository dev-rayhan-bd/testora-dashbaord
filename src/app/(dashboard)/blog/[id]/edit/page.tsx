import ArticleEditorPage from "@/components/blog/editor/ArticleEditorPage";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  return <ArticleEditorPage blogId={id} />;
}

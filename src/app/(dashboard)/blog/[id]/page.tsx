import BlogDetailsPage from "@/components/blog/BlogDetailsPage";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ViewBlogPage({ params }: Props) {
  const { id } = await params;
  return <BlogDetailsPage blogId={id} />;
}
